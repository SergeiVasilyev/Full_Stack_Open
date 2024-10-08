const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')



blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})


blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})


blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const body = request.body
  const user = request.user

  const blogObject = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes === undefined ? 0 : body.likes,
    user: user.id
  })
  
  const savedBlog = await blogObject.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  // add to blog object the user object
  const populatedBlog = await Blog.findById(savedBlog._id).populate('user', { username: 1, name: 1 })

  response.status(201).json(populatedBlog)
})


blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  // console.log('user', user)
  
  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (!blog.user) { // if the blog has no user attribute
    return response.status(401).json({ error: 'This blog was created by another user' })
  }
  if (blog.user.toString() !== user.id) { // if the blog was created by another user
    return response.status(401).json({ error: 'This blog was created by another user' })
  }

  await Blog.findByIdAndDelete(request.params.id)

  // Remove blog from user table
  user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
  await user.save()

  response.status(204).end()
})

// Update blog for owners (Owners can change all fields except likes)
blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  const body = request.body

  const blog = await Blog.findById(request.params.id)
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }
  if (!blog.user) { // if the blog has no user attribute
    return response.status(401).json({ error: 'This blog was created by another user' })
  }
  if (blog.user.toString() !== user.id) { // if the blog was created by another user
    return response.status(401).json({ error: 'This blog was created by another user' })
  }

  // Users can only like other people's blogs
  const blogForUpdate = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: blog.likes,
    user: user.id
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogForUpdate, { new: true }).populate('user', { username: 1, name: 1 })
  response.status(201).json(updatedBlog)
})

// Update likes
blogsRouter.put('/like/:id', async (request, response) => {
  const body = request.body
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (!blog) {
    return response.status(404).json({ error: 'blog not found' })
  }

  const blogForUpdate = {
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: body.likes,
    user: blog.user
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blogForUpdate, { new: true }).populate('user', { username: 1, name: 1 })
  response.status(201).json(updatedBlog)
})

module.exports = blogsRouter