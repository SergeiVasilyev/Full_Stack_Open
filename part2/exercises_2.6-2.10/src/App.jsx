import { useState } from 'react'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', phone: '040-123456' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    console.log(persons, newName)

    if (persons.find(person => person.name === newName)) {
      return alert(`${newName} is already added to phonebook`)
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
      <form onSubmit={addNote}>
        <div>
          <label htmlFor="name">Name</label>
          <input id="name" value={newName} onChange={handleNameChange} />
          <label htmlFor="phone">Phone number</label>
          <input id="phone" value={newPhone} onChange={handlePhoneChange} />
          <button type="submit">add</button>
        </div>
      </form>
      <br />
      <h2>Numbers</h2>
      <div>
        <ul className='no-bullets'>
        {persons.map(person =>
          <li key={person.name}>{person.name} — {person.phone}</li>
        )}
        </ul>
      </div>
    </div>
  )
}

export default App