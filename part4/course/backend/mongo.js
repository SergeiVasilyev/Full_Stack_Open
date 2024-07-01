/* eslint-disable @stylistic/js/linebreak-style */
const mongoose = require('mongoose')
// const config = require('./utils/config')
require('dotenv').config()

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

// const password = process.argv[2]

// const url =
//   `mongodb+srv://sergeyvasilyevdev:${password}@cluster0.uxfjgyo.mongodb.net/noteApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(process.env.TEST_MONGODB_URI).then(() => {
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  const note = new Note({
    content: 'HTML is x 22',
    important: true,
  })

  note.save().then(() => {
    console.log('note saved!')
    mongoose.connection.close()
  })

  Note.find({}).then(result => {
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
})