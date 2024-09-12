import { useState } from 'react'

const Blog = ({ blog, handleLike, user, handleRemove }) => {
  const [show, setShow] = useState(false)

  const checkUser = () => {
    if (user && 'user' in blog) {
      if (user.username === blog.user.username) {
        return true
      }
    }
    return false
  }

  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 2,
  }

  const showStyle = {
    display: show ? '' : 'none'
  }

  return (
    <div style={blogStyle}>
      <p className="blog-title">{blog.title}</p>
      <p>{blog.author} <button onClick={() => setShow(!show)}>{show ? 'hide' : 'see more'}</button></p>
      <div className="blog-info" style={showStyle}>
        <p>{blog.url}</p>
        <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
        {checkUser() ? <button onClick={() => handleRemove(blog)}>remove</button> : null}
      </div>
    </div>
  )}

export default Blog