const ShowCountry = ({ country }) => {
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

export default ShowCountry