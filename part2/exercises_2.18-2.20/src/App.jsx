import { useState, useEffect } from 'react'
import countryService from './servisces/countries'
import ShowResponse from './components/ShowResponse'
import './App.css'



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
