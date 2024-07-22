const {test, after, beforeEach} = require('node:test')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)


beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 2)
})

test('unique identifier property is called id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        console.log('id' in blog)
        assert.strictEqual('id' in blog, true)
    })
})




after(async () => {
    await mongoose.connection.close()
})