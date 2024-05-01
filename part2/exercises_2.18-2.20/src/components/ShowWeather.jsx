const ShowWeather = ({ weather }) => {
  if (!weather) {
    return null
  }
  
  return (
    <div>
      <p>Temperature: {weather.main.temp} °C</p>
      <p>Wind: {weather.wind.speed} m/s</p>
      <p>Humidity: {weather.main.humidity} %</p>
      <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt="weather" />
      <p>{weather.weather[0].description}</p>
    </div>
  )
}

export default ShowWeather