import InputComponent from './InputComponent'

const PersonForm = ({ addNote, newName, handleNameChange, newPhone, handlePhoneChange }) => {
    return (
      <form onSubmit={addNote}>
        <div>
          <InputComponent id="name" labelName="Name" value={newName} handleChange={handleNameChange} />
          <InputComponent id="phone" labelName="Phone number" value={newPhone} handleChange={handlePhoneChange} />
          <button type="submit">add</button>
        </div>
      </form>
    )
  }

export default PersonForm