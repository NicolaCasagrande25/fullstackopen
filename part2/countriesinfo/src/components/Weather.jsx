import weatherService from "../services/weather";  

const Weather = ({ capital, weatherInfo }) => {
  if (!capital || !weatherInfo) {
    return <div>An error occured while getting the weather data.</div>;
  }
  return (
    <div>
      <h2>{`Weather in ${capital}`}</h2>
      <div>{`temperature ${weatherInfo.main.temp} Celsius`}</div>
      {
        <img
          src={weatherService.getWeatherIconUrl(
            weatherInfo.weather[0].icon ?? ""
          )}
          alt={weatherInfo.weather[0].description ?? ""}
          width="100"
        />
      }
      <div>{`wind ${weatherInfo.wind.speed} m/s`}</div>
    </div>
  );
};

export default Weather;
