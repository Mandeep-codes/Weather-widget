import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SearchIcon from '@mui/icons-material/Search';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SunnyIcon from '@mui/icons-material/Sunny';
import "./SearchBox.css";
import { useState } from 'react';

export default function SearchBox() {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);

    const GEO_API = "https://api.openweathermap.org/geo/1.0/direct";
    const WEATHER_API = "https://api.openweathermap.org/data/2.5/weather";
    const API_KEY = "a7cc26a9fda2e47c86f07bcc0db476b7";

    let INIT_URL = "https://images.unsplash.com/photo-1561484930-682c8752c88d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    let HOT_URL = "https://images.unsplash.com/photo-1504370805625-d32c54b16100?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    let COLD_URL = "https://images.unsplash.com/photo-1612208695882-02f2322b7fee?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    let RAIN_URL = "https://images.unsplash.com/photo-1475116127127-e3ce09ee84e1?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

    const getWeatherInfo = async () => {
        try {
            const geoRes = await fetch(`${GEO_API}?q=${city}&limit=1&appid=${API_KEY}`);
            const geoData = await geoRes.json();

            if (!geoData.length) {
                alert("City not found!");
                return;
            }

            const { lat, lon } = geoData[0];

            const weatherRes = await fetch(`${WEATHER_API}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            const weatherData = await weatherRes.json();

            const result = {
                temp: weatherData.main.temp,
                tempMin: weatherData.main.temp_min,
                tempMax: weatherData.main.temp_max,
                humidity: weatherData.main.humidity,
                feelsLike: weatherData.main.feels_like,
                weather: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon,
                name: weatherData.name
            };

            setWeather(result);
        } catch (err) {
            console.error("Error fetching weather:", err);
            alert("Something went wrong. Try again.");
        }
    };

    const handleChange = (e) => setCity(e.target.value);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (city.trim()) {
            getWeatherInfo();
            setCity("");
        }
    };

    return (
        <div className='SearchBox'>
            <h3>Search for the weather</h3>

            <form onSubmit={handleSubmit}>
                <TextField
                    id="outlined-basic"
                    label="City Name"
                    variant="outlined"
                    required
                    value={city}
                    onChange={handleChange}
                />
                <br /><br />
                <Button variant="contained" type='submit' endIcon={<SearchIcon />}>
                    Search
                </Button>
            </form>

            {weather && (
                <Card sx={{ maxWidth: 345, marginTop: 4 }}>
                    <CardMedia
                        component="img"
                        height="140"
                        image={weather.humidity > 80 ? RAIN_URL : weather.temp > 15 ? HOT_URL : COLD_URL}
                        alt="Weather Icon"
                        sx={{ objectFit: "contain", backgroundColor: "#f0f0f0" }}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {weather.name} {weather.humidity > 80 ? <ThunderstormIcon/> : weather.temp > 15 ? <SunnyIcon/> : <AcUnitIcon/>}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            
                            <strong>Temperature:</strong> {weather.temp}°C<br />
                            <strong>Feels Like:</strong> {weather.feelsLike}°C<br />
                            <strong>Min:</strong> {weather.tempMin}°C | <strong>Max:</strong> {weather.tempMax}°C<br />
                            <strong>Humidity:</strong> {weather.humidity}%<br />
                            <strong>Condition:</strong> {weather.weather}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" onClick={() => setWeather(null)}>Clear</Button>
                    </CardActions>
                </Card>
            )}
        </div>
    );
}
