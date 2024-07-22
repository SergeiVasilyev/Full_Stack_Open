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
        assert.strictEqual('id' in blog, true)
    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: 'Blog test',
        author: 'Sergey V',
        url: 'http://localhost/33',
        likes: 153
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    assert.strictEqual(contents.includes('Blog test'), true)
})

test('likes property by defaults is 0', async () => {
    const newBlog = {
        title: 'Blog test',
        author: 'Sergey V',
        url: 'http://localhost/33'
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
    
    const blog = blogsAtEnd.find(blog => blog.title === 'Blog test')
    assert.strictEqual(blog.likes, 0)
})

after(async () => {
    await mongoose.connection.close()
})