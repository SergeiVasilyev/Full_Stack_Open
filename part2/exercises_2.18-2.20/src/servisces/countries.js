import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/'

let key = import.meta.env.VITE_PYOWM_API_KEY

const getAll = () => {
    const request = axios.get(`${baseUrl}/all`)
    return request.then(response => response.data)
}

const getByName = (name) => {
    const request = axios.get(`${baseUrl}/name/${name}`)
    return request.then(response => response.data)
}

const getWetherForCity = (city) => {
    const request = axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`)
    return request.then(response => response.data)
}

const getWetherForCityLocalServer = (city) => {
    console.log('city', city)
    const request = axios.get(`http://localhost:3001/moscow`)
    return request.then(response => response.data)

}

export default { getAll, getByName, getWetherForCity, getWetherForCityLocalServer }