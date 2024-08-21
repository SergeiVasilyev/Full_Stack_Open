import { useState } from "react"

const Blog = ({ blog, handleLike }) => {
  const [show, setShow] = useState(false)
  
  const blogStyle = {
    paddingTop: 2,
    paddingLeft: 2,
  }

  const showStyle = {
    display: show ? '' : 'none'
  }
  
  return (
  <div style={blogStyle}>
    <p className="blog-title">{blog.title} <button onClick={() => setShow(!show)}>{show ? 'hide' : 'see more'}</button></p>
    <div className="blog-info" style={showStyle}>
      <p>{blog.url}</p>
      <p>likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button></p>
      <p>{blog.author}</p>
    </div>
  </div>  
)}

export default Blog