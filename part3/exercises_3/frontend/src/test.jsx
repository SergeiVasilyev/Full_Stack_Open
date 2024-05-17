import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleNoteChange = (event) => {
    setNewName(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          <form onSubmit={event => event.preventDefault()}>
            name: <input value={newName} onChange={handleNoteChange} />
            <button type="submit">add</button>
          </form>
        </div>
      </form>
      <h2>Numbers</h2>
      ...
    </div>
  )
}

export default App