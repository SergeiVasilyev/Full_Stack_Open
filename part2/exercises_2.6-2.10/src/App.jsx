import { useState } from 'react'
import './App.css'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNoteChange = (event) => {
    setNewName(event.target.value)
  }

  const addNote = (event) => {
    event.preventDefault()
    console.log(persons, newName)

    if (persons.find(person => person.name === newName)) {
      return alert(`${newName} is already added to phonebook`)
    }

    const noteObject = {
      name: newName
    }
    setPersons(persons.concat(noteObject))
    setNewName('')
    
  }

  return (
    <div className='app'>
      <h2>Phonebook</h2>
      <form onSubmit={addNote}>
        <div>
          <input value={newName} onChange={handleNoteChange} />
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        <ul className='no-bullets'>
        {persons.map(person =>
          <li key={person.name}>{person.name}</li>
        )}
        </ul>
      </div>
    </div>
  )
}

export default App