var _ = require('lodash');

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const sum = (sum, item) => sum + item.likes
  return blogs.reduce(sum, 0)
}


const favoriteBlog = (blogs) => { 
  if (blogs.length === 0) {
    return null
  }
  const likesArr = blogs.map(blog => blog.likes)
  const maxLikes = Math.max(...likesArr)
  const blog = blogs.find(blog => blog.likes === maxLikes)
  delete blog._id
  delete blog.__v
  delete blog.url
  return blog
}

const mostBlogs = (blogs) => {
  let blogAcc = {}
  for (blog of blogs) {
    if (blogAcc[blog.author]) {
      blogAcc[blog.author] += 1
    } else {
      blogAcc[blog.author] = 1
    }
  }

  const maxBlogs = Math.max(...Object.values(blogAcc))
  const author = Object.keys(blogAcc).find(key => blogAcc[key] === maxBlogs)

  return {
    author: author,
    blogs: maxBlogs
  }
}

const mostBlogsLodash = (blogs) => {
  let mostBlogs = _.chain(blogs)
    .countBy('author')
    .map((value, key) => ({ author: key, blogs: value }))
    .maxBy('blogs')
    .value()
  return mostBlogs
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostBlogsLodash
}


