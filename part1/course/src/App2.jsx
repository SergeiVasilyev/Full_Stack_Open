import { useState } from 'react'


const App = () => {
    const [value, setValue] = useState(10)
  
  
    const hello = (who) => {
      const handler = () => {
        console.log('hello', who)
      }
      return handler
    }

    const setToValue = (newValue) => () => {
        console.log('value now', newValue)  // print the new value to console
        setValue(newValue)
    }
  
    return (
      <div>
        {value}
        {/* We can send a function or a value as an argument */}
        <button onClick={hello('world')}>button</button> 
        <button onClick={hello('react')}>button</button>
        <button onClick={hello('function')}>button</button>

        <button onClick={setToValue(1000)}>thousand</button>
        <button onClick={setToValue(0)}>reset</button>
        <button onClick={setToValue(value + 1)}>increment</button>
      </div>
    )
  }

  export default App