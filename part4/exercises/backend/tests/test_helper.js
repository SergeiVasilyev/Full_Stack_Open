/* eslint-disable @stylistic/js/linebreak-style */
const { response } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const app = require('../app')
const supertest = require('supertest')
const api = supertest(app)

const initialBlogs = [
  {
    title: 'Blog 1',
    author: 'Alex Blog',
    url: 'http://localhost',
    likes: 5
  },
  {
    title: 'Blog 2',
    author: 'Alex Blog',
    url: 'http://localhost',
    likes: 10
  }
]


const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const initUsers = async () => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('test', saltRounds)

  const initialUsers = [{
    username: 'test',
    name: 'test',
    passwordHash: passwordHash
  }]

  return initialUsers
}

const login = async () => {
  const response = await api
    .post('/api/login')
    .send({
      username: 'test',
      password: 'test'
    })
    .set('Content-Type', 'application/json')
  return response
}


const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

module.exports = {
  initialBlogs, blogsInDb, nonExistingId, initUsers, usersInDb, login
}