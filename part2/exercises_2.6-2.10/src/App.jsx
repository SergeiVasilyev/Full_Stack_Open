import { useState } from 'react'
import InputComponent from './components/InputComponent'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import './App.css'


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456', id: 1 },
    { name: 'Ada Lovelace', phone: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', phone: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', phone: '39-23-6423122', id: 4 }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [search, setSearch] = useState('')

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
      phone: newPhone
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
      <h2>Numbers</h2>
      <Persons persons={persons} search={search} />
    </div>
  )
}

export default App