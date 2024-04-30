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

const ShowCountries = ({ countries, handleGetCountry }) => {
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
    <CountriesList countries={countries} handleGetCountry={handleGetCountry} />
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

  const handleGetCountry = (countryName) => {
    countryService
      .getByName(countryName)
      .then(country => setCountries([country]))
  }


  return (
    <div className='app'>
      <div className='search_wrapper'>
        <label htmlFor="search">Find countries</label>
        <input id="search" value={search} onChange={handleSearch} />
      </div>
      <ShowCountries countries={countries} handleGetCountry={handleGetCountry} />
    </div>
  )
}

export default App
