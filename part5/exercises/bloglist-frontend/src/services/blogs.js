import axios from 'axios'
// const baseUrl = '/api/blogs'
const baseUrl = 'http://localhost:3003/api/blogs'


let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const createBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const updateLikesInBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.put(`${baseUrl}/like/${blog.id}`, blog, config)
  return response.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.delete(`${baseUrl}/${id}`, config)
  return response.data
}


export default { getAll, createBlog, setToken, updateLikesInBlog, deleteBlog }
