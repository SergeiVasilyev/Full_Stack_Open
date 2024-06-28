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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}


