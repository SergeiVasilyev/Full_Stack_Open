import { useState } from 'react'

const BlogForm = ({ handleAddBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')


  const addBlog = (event) => {
    event.preventDefault()
    handleAddBlog({
      title, author, url, likes: 0
    })
    console.log('title', title, 'author', author, 'url', url)
    setTitle('')
    setAuthor('')
    setUrl('')
  }


  return(
    <div>
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        <div>
                    title
          <input type="text" name="Title" placeholder='Title' value={title} onChange={(e) => setTitle(e.target.value)}/>
        </div>
        <div>
                    author
          <input type="text" name="Author" placeholder='Author' value={author} onChange={(e) => setAuthor(e.target.value)} />
        </div>
        <div>
                    url
          <input type="text" name="Url" placeholder='Url' value={url} onChange={(e) => setUrl(e.target.value)} />
        </div>
        <button>create</button>
      </form>
    </div>
  )}

export default BlogForm