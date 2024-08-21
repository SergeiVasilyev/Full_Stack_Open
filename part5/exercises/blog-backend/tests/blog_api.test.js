const {test, after, beforeEach, before} = require('node:test')
const mongoose = require('mongoose')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')
const assert = require('node:assert')
const api = supertest(app)


let loggedInUser
let token

beforeEach(async () => {
    await Blog.deleteMany({})
    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

before(async () => {
    await User.deleteMany({})
    const users = await helper.initUsers()
    const userObjects = users
        .map(user => new User(user))
    const promiseArray = userObjects.map(user => user.save())
    await Promise.all(promiseArray)
})

beforeEach(async () => {
    const user = await User.findOne({username: 'test'})
    user.blogs = []
    await user.save()
})

// Add Blog with user field and add it to user
beforeEach(async () => {
    const user = await User.findOne({username: 'test'})
    const newBlog = {
        title: 'Blog 3',
        author: 'Alex Blog',
        url: 'http://localhost/3',
        likes: 5,
        user: user.id
    }
    const blog = new Blog(newBlog)
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
})

// Login a user
before(async () => {
    const loginResponse = await helper.login()
    loggedInUser = await User.findOne({username: 'test'})
    token = loginResponse.body.token
    // console.log(loggedInUser, token)
    console.log('loggedInUser id', loggedInUser.id)
})

test('create a user', async () => {
    const addNewUser = {
        username: 'test2',
        name: 'test2',
        password: 'test2'
    }
    await api
        .post('/api/users')
        .send(addNewUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    const users = await helper.initUsers()
    assert.strictEqual(usersAtEnd.length, users.length + 1)

    const contents = usersAtEnd.map(user => user.username)
    assert.strictEqual(contents.includes('test2'), true)
})

test('Login a user', async () => {
    const user = {
        username: 'test',
        password: 'test'
    }
    const response = await api
        .post('/api/login')
        .send(user)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.username, 'test')
    assert.strictEqual(response.body.name, 'test')

    const token = response.body.token
    assert(token.length > 10)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are two blogs', async () => {
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, 3)
})

test('unique identifier property is called id', async () => {
    const response = await api.get('/api/blogs')
    response.body.forEach(blog => {
        assert.strictEqual('id' in blog, true)
    })
})

test('a valid blog can be added', async () => {
    const blogsAtStart = await helper.blogsInDb()
    // const loginResponse = await helper.login()
    const newBlog = {
        title: 'This is a valid blog',
        author: 'Sergey V',
        url: 'http://localhost/33',
        likes: 5,
        user: loggedInUser.id
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    assert.strictEqual(contents.includes('This is a valid blog'), true)
})

test('blog without token is not added', async () => {
    const newBlog = {
        title: 'This blog has not been added',
        author: 'Sergey V',
        url: 'http://localhost/34',
        likes: 5
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, 3)

    const contents = blogsAtEnd.map(blog => blog.title)
    assert.strictEqual(contents.includes('This blog has not been added'), false)
})


test('likes property by defaults is 0', async () => {
    const blogsAtStart = await helper.blogsInDb()

    const newBlog = {
        title: 'Blog test 2',
        author: 'Sergey V',
        url: 'http://localhost/34',
        user: loggedInUser.id
    }
    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1)
    
    const blog = blogsAtEnd.find(blog => blog.title === 'Blog test 2')
    assert.strictEqual(blog.likes, 0)
})

test('blog without required properties is not added', async () => {
    const newBlog = {
        author: 'Sergey V',
        likes: 153,
        user: loggedInUser.id
    }
    const response = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

    for (const error in response.body.errors) {
        assert.strictEqual(response.body.errors[error].message, "Path `" + response.body.errors[error].path + "` is required.")
    }
})


test('a blog can be deleted', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[blogsAtStart.length - 1]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const contents = blogsAtEnd.map(blog => blog.title)
    assert.strictEqual(contents.includes(blogToDelete.title), false)
})

test('a blog can be updated', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlog = {
        ...blogToUpdate,
        likes: blogToUpdate.likes + 1
    }
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updatedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    const contents = blogsAtEnd.map(blog => blog.likes)
    // console.log(contents)
    assert.strictEqual(contents.includes(blogToUpdate.likes + 1), true)

})


after(async () => {
    await mongoose.connection.close()
})