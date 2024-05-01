import ShowCountry from "./ShowCountry"
import ShowWeather from "./ShowWeather"
import CountriesList from "./CountriesList"

const ShowResponse = ({ countries, weather, handleGetCountry }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  
  if (countries.length === 1) {
    return (
      <div>
        <h1>{countries[0].name.official}</h1>
        <ShowCountry country={countries[0]} />
        <h3>Weather in {countries[0].capital}</h3>
        <ShowWeather weather={weather} />
      </div>
    )
  }

  return (
    <CountriesList countries={countries} handleGetCountry={handleGetCountry} />
  )
}

export default ShowResponse