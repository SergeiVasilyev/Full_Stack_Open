const Persons = ({ persons, search, handleDelete }) => {
    return (
      <div>
        <ul className='no-bullets'>
          {persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person => {
            return (
              <div key={person.id} className="person">
                <li key={person.id}>{person.name} — {person.number}</li>
                <button onClick={() => handleDelete(person.id)}>delete</button>
              </div>
            )}
          )}
        </ul>
      </div>
    )
  }

export default Persons