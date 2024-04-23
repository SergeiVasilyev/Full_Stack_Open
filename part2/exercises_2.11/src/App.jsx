import { useState, useEffect } from 'react'
import axios from 'axios'
import InputComponent from './components/InputComponent'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import './App.css'


const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  })

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }
  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    console.log(persons, newName)

    if (persons.find(person => person.name === newName)) {
      return alert(`${newName} is already added to phonebook`)
    }

    if (newName === '' || newPhone === '') {
      return alert('Name and phone number are required')
    }

    const noteObject = {
      name: newName,
      number: newPhone
    }
    setPersons(persons.concat(noteObject))
    setNewName('')
    setNewPhone('')
  }

  return (
    <div className='app'>
      <h2>Phonebook</h2>
      <InputComponent id="filter" labelName="Search contact" value={search} handleChange={handleSearch} />
      <PersonForm addNote={addNote} newName={newName} handleNameChange={handleNameChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />
      <br />
      {persons.length===0 ? '' : <h2>Numbers2</h2>}
      <Persons persons={persons} search={search} />
    </div>
  )
}

export default App