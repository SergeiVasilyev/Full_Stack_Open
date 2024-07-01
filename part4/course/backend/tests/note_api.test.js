/* eslint-disable @stylistic/js/linebreak-style */
const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')

const Note = require('../models/note')

const api = supertest(app)

const initialNotes = [
  {
    content: 'HTML is easy',
    important: false,
  },
  {
    content: 'Browser can execute only JavaScript',
    important: true,
  },
]

beforeEach(async () => {
  await Note.deleteMany({})
  let noteObject = new Note(initialNotes[0])
  await noteObject.save()
  noteObject = new Note(initialNotes[1])
  await noteObject.save()
})

test('notes are returned as json', async () => {
  await api
    .get('/api/notes')
    .expect(200)
    .expect('Content-Type', /application\/json/) // or 'application/json'
})

test('there are two notes', async () => {
  const response = await api.get('/api/notes')
  assert.strictEqual(response.body.length, initialNotes.length)
})

test('the first note is about HTTP methods', async () => {
  const response = await api.get('/api/notes')
  const contents = response.body.map(e => e.content)
  assert(contents.includes('HTML is easy'))
})

after(async () => {
  await mongoose.connection.close()
})


// Command to run all tests: npm test
// Command to run just "only" marked tests: npm test -- --test-only
// test.only() is used to run only one test
// Command to run just one test in a file: npm test -- tests/note_api.test.js

// The --tests-by-name-pattern option can be used for running tests with a specific name:
// npm test -- --test-name-pattern="the first note is about HTTP methods"

// The following command will run all of the tests that contain notes in their name:
// npm test -- --test-name-pattern="note"