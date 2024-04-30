import { useState, useEffect } from 'react'
import countryService from './servisces/countries'

const ShowCountries = ({ countries }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }
  if (countries.length === 1) {
    const languages = []
    Object.keys(countries[0].languages).forEach(key => languages.push(countries[0].languages[key]))
    return (
      <div>
        <h1>{countries[0].name.official}</h1>
        <p>Capital: {countries[0].capital}</p>
        <p>Population: {countries[0].population}</p>
        <p>Area: {countries[0].area}</p>
        <h3>Languages</h3>
        <ul>
          {languages.map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={countries[0].flags.png} alt="flag" />
      </div>
    )
  }
  return (
    <ul>
      {countries.map(country => <li key={country.name.official}>{country.name.official}</li>)}
    </ul>
  )
}

function App() {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')


  const handleSearch = (event) => {
    setSearch(event.target.value)
    if (event.target.value.length > 1) {
      countryService
        .getAll()
        .then(initialNotes => {
          let countries = initialNotes.filter(country => country.name.official.toLowerCase().includes(search.toLowerCase()))
          console.log(countries)
          setCountries(countries)
        })
    }
  }



  return (
    <div>
      <label htmlFor="search">Find countries</label>
      <input id="search" value={search} onChange={handleSearch} />
      <ShowCountries countries={countries} />
    </div>
  )
}

export default App
