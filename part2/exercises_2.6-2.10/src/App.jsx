import { useState } from 'react'
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

  const handleSearch = (event) => {
    setSearch(event.target.value)
  }


  return (
    <div className='app'>
      <h2>Phonebook</h2>
      <input value={search} onChange={handleSearch} />
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
        {persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person =>
          <li key={person.name}>{person.name} — {person.phone}</li>
        )}
        </ul>
      </div>
    </div>
  )
}

export default App