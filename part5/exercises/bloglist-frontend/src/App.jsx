import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import { jwtDecode } from 'jwt-decode'
import Togglable from './components/Togglable'
import './App.css'


const Notification = ({ message, className }) => {
  if (message === '' || message === null) {
    className = ''
  }

  if (message === null) {
    return null
  }

  return (
    <div className={className}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()


  const handleAddBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()
    try {
      const response = await blogService.createBlog(blogObject)
      setBlogs(blogs.concat(response))
      console.log('response', response)
      setSuccessMessage(`a new blog ${response.title} by ${response.author} added`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage(exception.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    console.log('loggedUserJSON', loggedUserJSON)

    const token =
      JSON.parse(localStorage.getItem('loggedBlogappUser')) &&
      JSON.parse(localStorage.getItem('loggedBlogappUser'))['token']

    if (loggedUserJSON) {
      if (jwtDecode(token).exp < Date.now() / 1000) {
        console.log(Date.now() / 1000, jwtDecode(token).exp)
        handleLogout()
      } else {
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      }
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setSuccessMessage(`welcome back ${user.name}`)
      setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Wrong Username or Password: ' + exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
    console.log('logging in with', username, password)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')

    setSuccessMessage('you logged out')
    setTimeout(() => {
      setSuccessMessage(null)
    }, 5000)

    setUser(null)
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const handleLike = async (blog) => {
    const updatedBlogObj = { ...blog, likes: blog.likes + 1 }
    try {
      const updatedBlog = await blogService.updateLikesInBlog(updatedBlogObj)
      setBlogs(blogs.map(b => b.id !== blog.id ? b : updatedBlog))
    } catch (exception) {
      setErrorMessage('exception' + exception)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleRemove = async (blog) => {
    if (window.confirm(`Are you sure you want to remove ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.deleteBlog(blog.id)
        setBlogs(blogs.filter(b => b.id !== blog.id))
      } catch (exception) {
        setErrorMessage('exception' + exception)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      }
    }
  }


  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort((a, b) => b.likes - a.likes)
      setBlogs( blogs )
    })
  }, [])

  return (
    <div>
      <Notification message={errorMessage} className="error"/>
      <Notification message={successMessage} className="success" />
      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={() => handleLogout()}>logout</button>
          <p></p>
          <Togglable buttonLabel="Create new blog" ref={blogFormRef}>
            <BlogForm handleAddBlog={handleAddBlog} />
          </Togglable>
        </div>
      }
      <h2>blogs</h2>
      <div className="blogs">
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} handleLike={handleLike} user={user} handleRemove={handleRemove} />
        )}
      </div>
    </div>
  )
}

export default App