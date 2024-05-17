const Persons = ({ persons, search, handleDelete }) => {
    return (
      <div>
        <ul className='no-bullets'>
          {persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person => {
            return (
              <li key={person.id} className="person">
                <span key={person.id}>{person.name} — {person.number}</span>
                <button onClick={() => handleDelete(person.id)}>delete</button>
              </li>
            )}
          )}
        </ul>
      </div>
    )
  }

export default Persons