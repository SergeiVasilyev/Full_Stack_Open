import { useState, useEffect } from 'react'
import countryService from './servisces/countries'
import './App.css'


const ShowButton = ({ show }) => {
  return (
    <button onClick={show}>show</button>
  )
}

const CountriesList = ({ countries, handleGetCountry }) => {
  return (
    <ul className='countries_list'>
      {countries.map((country) => {
          return (
            <li key={country.name.official}>
              <span>{country.name.official}</span>
              <ShowButton show={() => handleGetCountry(country.name.official)} />
            </li>
          )
        }
      )}
    </ul>
  )
}

const ShowWeather = ({ weather }) => {
  if (!weather) {
    return null
  }
  // return (
  //   <div>
  //     <p>Temperature: {weather.main.temp}</p>
  //   </div>
  // )
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

const ShowCountry = ({ country, weather }) => {
  const languages = []
  Object.keys(country.languages).forEach(key => languages.push(country.languages[key]))
  return (
    <div>
      <p>Capital: {country.capital}</p>
      <p>Population: {country.population}</p>
      <p>Area: {country.area}</p>
      <h3>Languages</h3>
      <ul>
        {languages.map(language => <li key={language}>{language}</li>)}
      </ul>
      <img src={country.flags.png} alt="flag" />
    </div>
  )
}

const ShowResponse = ({ countries, weather, handleGetCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name.official}</h1>
        <ShowCountry country={countries[0]} weather={weather} />
        <h3>Weather in {countries[0].capital}</h3>
        <ShowWeather weather={weather} />
      </div>
    )
  }
  return (
    <CountriesList countries={countries} handleGetCountry={handleGetCountry} />
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [weather, setWeather] = useState(null)


  const handleSearch = (event) => {
    setSearch(event.target.value)
    if (event.target.value.length > 1) {
      countryService
        .getAll()
        .then(initialNotes => {
          let countries = initialNotes.filter(country => country.name.official.toLowerCase().includes(event.target.value.toLowerCase()))
          setCountries(countries)
        })
    }
  }

  const handleGetCountry = (countryName) => {
    countryService
      .getByName(countryName)
      .then(country => setCountries([country]))
  }

  useEffect(() => {
    if (countries.length === 1) {
    countryService
      .getWetherForCity(countries[0].capital[0])
      .then(weather => setWeather(weather))
    }
  }, [countries])


  return (
    <div className='app'>
      <div className='search_wrapper'>
        <label htmlFor="search">Find countries</label>
        <input id="search" value={search} onChange={handleSearch} />
      </div>
      <ShowResponse countries={countries} weather={weather} handleGetCountry={handleGetCountry} />
    </div>
  )
}

export default App
