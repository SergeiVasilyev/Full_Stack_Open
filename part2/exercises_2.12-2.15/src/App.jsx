import { useState, useEffect } from 'react'
import axios from 'axios'
import InputComponent from './components/InputComponent'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import './App.css'
import contactService from './services/contacts'


const App = () => {
  const [persons, setPersons] = useState([]) 
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

  useEffect(() => {
    contactService
      .getContacts()
      .then(initialContacts => {
        setPersons(initialContacts)
      })
  })

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

    contactService
      .newContact(noteObject)
      .then(returnedContact => {
        setPersons(persons.concat(returnedContact))
        setNewName('')
        setNewPhone('')
      })
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete contact ${person.name} ?`)) {
      contactService
        .deleteContact(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          console.log(persons)
        })
    }
  }

  return (
    <div className='app'>
      <h2>Phonebook</h2>
      <InputComponent id="filter" labelName="Search contact" value={search} handleChange={handleSearch} />
      <PersonForm addNote={addNote} newName={newName} handleNameChange={handleNameChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />
      <br />
      {persons.length===0 ? '' : <h2>Numbers</h2>}
      <Persons persons={persons} search={search} handleDelete={handleDelete} />
    </div>
  )
}

export default App