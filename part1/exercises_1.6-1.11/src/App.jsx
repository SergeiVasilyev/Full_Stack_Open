import { useState } from 'react'
import './App.css'

const Title = ({ text }) => <h1>{text}</h1>
const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td><td>{value}</td>
    </tr>
  )}

  
const Statistics = ({ good, neutral, bad }) => {
  if ((good + neutral + bad) === 0) return <p>No feedback given</p>
  return (
    <div className='statistics'>
      <table>
        <tbody>
          <StatLine text='Good' value={good} />
          <StatLine text='Neutral' value={neutral} />
          <StatLine text='Bad' value={bad} />
          <StatLine text='All feedbacks' value={good + neutral + bad} />
          <StatLine text='Average score' value={(good - bad) / (good + neutral + bad)} />
          <StatLine text='Positive feedback' value={(good / (good + neutral + bad)) * 100} />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div className='app'>
      <Title text='Give your feedback' />

      <Button handleClick={() => setGood(good + 1)} text='good' />
      <Button handleClick={() => setNeutral(neutral + 1)} text='neutral' />
      <Button handleClick={() => setBad(bad + 1)} text='bad' />
      
      <Title text='Statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App