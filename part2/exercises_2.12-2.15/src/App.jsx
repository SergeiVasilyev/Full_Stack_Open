import { useState, useEffect } from 'react'
import InputComponent from './components/InputComponent'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import contactService from './services/contacts'
import './App.css'


const Notification = ({ message }) => {
  const messageColor = {
    color: '#45e314',
  }

  return (
    <div style={messageColor} className='message'>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState(null) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')


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

    if (newName === '' || newPhone === '') {
      return alert('Name and phone number are required')
    }

    if (persons.find(person => person.name === newName)) {
      const contact = persons.find(person => person.name === newName)
      const changedContact = { ...contact, number: newPhone }
      contactService
        .updateContact(contact.id, changedContact)
        .then(returnedContact => {
          setPersons(persons.map(person => person.name === newName ? returnedContact : person))
          setMessage(`${newName} updated`)
          setTimeout(() => {
            setMessage('')
          }, 5000)
        })
        .catch(error => {
          setMessage(`Error: Contact ${newName} not found`)
        })
        

    } else {
      const noteObject = {
        name: newName,
        number: newPhone
      }
      contactService
        .newContact(noteObject)
        .then(returnedContact => {
          setPersons(persons.concat(returnedContact))
        })
        .then(() => {
          setMessage(`${newName} added to the list`)
          setTimeout(() => {
            setMessage('')
          }, 5000)
        })
        .catch(error => {
          setMessage(`Error: ${error.response.data.error}`)
        })
    } 

    setNewName('')
    setNewPhone('')
  }

  const handleDelete = (id) => {
    const person = persons.find(person => person.id === id)
    if (window.confirm(`Delete contact ${person.name} ?`)) {
      contactService
        .deleteContact(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          setMessage(`Error: Information of ${person.name} has already been removed from server`)
        })
    }
  }

  if (!persons) { 
    return null 
  }

  return (
    <div className='app'>
      <h2>Phonebook</h2>
      <InputComponent id="filter" labelName="Search contact" value={search} handleChange={handleSearch} />
      <PersonForm addNote={addNote} newName={newName} handleNameChange={handleNameChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />
      <Notification message={message} />
      <br />
      {persons.length===0 ? '' : <h2>Numbers</h2>}
      <Persons persons={persons} search={search} handleDelete={handleDelete} />
    </div>
  )
}

export default App