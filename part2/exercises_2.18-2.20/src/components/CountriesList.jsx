import ShowButton from "./ShowButton"

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

export default CountriesList