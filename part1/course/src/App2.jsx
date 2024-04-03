import { useState } from 'react'


const Display = props => <div>{props.value}</div>
const Button = (props) => (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )

const App = () => {
    const [value, setValue] = useState(10)
  
  
    const hello = (who) => {
      const handler = () => {
        console.log('hello', who)
      }
      return handler
    }

    // Return a function inside a function
    const setToValue = (newValue) => () => {
        console.log('value now', newValue)  // print the new value to console
        setValue(newValue)
    }

    // Return a function
    const setToValue2 = newValue => {
        console.log('value now', newValue)
        setValue(newValue)
    }
  
    
    return (
      <div>
        <Display value={value} />
        {/* We can send a function or a value as an argument */}
        <button onClick={hello('world')}>button</button> 
        <button onClick={hello('react')}>button</button>
        <button onClick={hello('function')}>button</button>
        <br />
        <button onClick={setToValue(1000)}>thousand</button>
        <button onClick={setToValue(0)}>reset</button>
        <button onClick={setToValue(value + 1)}>increment</button>
        <br />
        <Button handleClick={() => setToValue2(1000)} text="thousand" />
        <Button handleClick={() => setToValue2(0)} text="reset" />
        <Button handleClick={() => setToValue2(value + 1)} text="increment" />
      </div>
    )
  }

  export default App