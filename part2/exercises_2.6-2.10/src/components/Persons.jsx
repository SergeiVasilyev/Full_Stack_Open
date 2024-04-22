const Persons = ({ persons, search }) => {
    return (
      <div>
        <ul className='no-bullets'>
          {persons.filter(person => person.name.toLowerCase().includes(search.toLowerCase())).map(person =>
            <li key={person.name}>{person.name} — {person.phone}</li>
          )}
        </ul>
      </div>
    )
  }

export default Persons