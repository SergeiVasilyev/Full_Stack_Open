/* eslint-disable @stylistic/js/linebreak-style */
const Blog = require('../models/blog')

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
  initialBlogs, blogsInDb, nonExistingId
}