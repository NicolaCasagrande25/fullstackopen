import axios from 'axios';
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
const imageUrl = 'https://openweathermap.org/img/wn/';
const API_KEY = import.meta.env.VITE_API_KEY;

const getCityWeather = (cityName) => {
    const request = axios.get(baseUrl, {
        params: {
            q: cityName,
            appid: API_KEY,
            units: 'metric'
        }
    });
    return request.then(response => response.data).catch(error => { return null; });
};

const getWeatherIconUrl = (iconName) => {
    return `${imageUrl}/${iconName}@2x.png`;
};

export default { getCityWeather, getWeatherIconUrl };