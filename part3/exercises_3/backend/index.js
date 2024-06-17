require('dotenv').config()

const express = require('express')
// let persons = require('./persons')
const Person = require('./models/persons')

const app = express()
app.use(express.static('dist'))
const morgan = require('morgan')

app.use(express.json())

const cors = require('cors')
app.use(cors())



morgan.token("response", function (req) {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :res[header] :response-time ms :status :response'))



// app.get('/', (req, res) => {
//   res.send(
//     `<h1>Server running</h1>
//     <a href="/api/persons">http://localhost:3001/api/persons</a>
//     <br>
//     <a href="/info">http://localhost:3001/info</a>`
//   )
// })


app.get('/api/persons/', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})


app.get('/api/persons/:id', (req, res) => {
  Person.findById(req.params.id)
  .then(person => {
    res.json(person)
  })
})


// app.delete('/api/persons/:id', (req, res) => {
//   const id = Number(req.params.id)
//   persons = persons.filter(person => person.id !== id)
//   res.status(204).end()
// })

app.delete('/api/persons/:id', (req, res) => {
  Person.findByIdAndDelete(req.params.id)
  .then(() => {
    res.status(204).end()
  })
  .catch(error => {
    console.log(error)
    res.status(400).end()
  })
})


const generateId = () => {
  randomID = Math.floor(Math.random()*100000)
  return randomID
}


app.post('/api/persons', (req, res) => {
  const body = req.body
  console.log('body', body)
  if (body.name === undefined) {
    return res.status(400).json({ error: 'Name missing' })
  }
  if (!body.number) {
    return res.status(400).json({ 
      error: 'Number missing' 
    })
  }

  // if (persons.find(person => person.name === body.name)) {
  //   return res.status(400).json({ 
  //     error: 'Name must be unique' 
  //   })
  // }

  const newPerson = new Person({
    name: body.name,
    number: body.number
  })

  newPerson.save().then(savedPerson => {
    res.json(savedPerson)
  })

  // persons = persons.concat(newPerson)
  // res.json(newPerson) // It was wrong in the exercise of part 2: should return just one person, not all persons
})


app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    <a href="/">Go to main page</a>`
  )
})


const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})