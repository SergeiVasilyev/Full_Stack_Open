const InputComponent = ({ id, labelName, value, handleChange }) => {
    return (
      <>
        <label htmlFor={id}>{labelName}</label>
        <input id={id} value={value} onChange={handleChange} />
      </>
    )
}

export default InputComponent