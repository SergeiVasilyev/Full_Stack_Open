const express = require('express')
let persons = require('./persons')
const app = express()
const morgan = require('morgan')

app.use(express.json())

const cors = require('cors')
app.use(cors())



morgan.token("response", function (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :res[header] :response-time ms :status :response'))



app.get('/', (req, res) => {
  res.send(
    `<h1>Server running</h1>
    <a href="/api/persons">http://localhost:3001/api/persons</a>
    <br>
    <a href="/info">http://localhost:3001/info</a>`
  )
})


app.get('/api/persons/', (req, res) => {
  res.json(persons)
})


app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404)
    res.send('Person not found')
  }
})


app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})


const generateId = () => {
  randomID = Math.floor(Math.random()*100000)
  return randomID
}


app.post('/api/persons', (req, res) => {
  const body = req.body
  let id = generateId()
  
  if (!body.name) {
    return res.status(400).json({ 
      error: 'Name missing' 
    })
  }
  if (!body.number) {
    return res.status(400).json({ 
      error: 'Number missing' 
    })
  }
  if (persons.find(person => person.name === body.name)) {
    return res.status(400).json({ 
      error: 'Name must be unique' 
    })
  }

  const newPerson = {
    id: id,
    name: body.name,
    number: body.number
  }
  persons = persons.concat(newPerson)
  res.json(newPerson) // It was wrong in the exercise of part 2: should return just one person, not all persons
})


app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    <a href="/">Go to main page</a>`
  )
})


const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})