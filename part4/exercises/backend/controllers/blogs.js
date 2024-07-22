const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


// Use async/await
blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

// Use promises
// blogsRouter.get('/', (request, response) => {
//   Blog
//     .find({})
//     .then(blogs => {
//       response.json(blogs)
//     })
// })


// Use async/await
blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

// Use promises
// blogsRouter.post('/', (request, response) => {
//   const blog = new Blog(request.body)

//   blog
//     .save()
//     .then(result => {
//       response.status(201).json(result)
//     })
// })


// Post blog using async/await
blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body) 
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})




module.exports = blogsRouter