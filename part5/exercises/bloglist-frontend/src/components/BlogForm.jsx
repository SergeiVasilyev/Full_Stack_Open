
const BlogForm = ({handleTitleChange, handleAuthorChange, handleUrlChange, title, author, url, handleSubmitBlog}) => (
    <div>
        <h2>create new blog</h2>
        <form onSubmit={handleSubmitBlog}>
            <div>
                title
                <input type="text" name="Title" value={title} onChange={(e) => handleTitleChange(e)}/>
            </div>
            <div>
                author
                <input type="text" name="Author" value={author} onChange={(e) => handleAuthorChange(e)} />
            </div>
            <div>
                url
                <input type="text" name="Url" value={url} onChange={(e) => handleUrlChange(e)} />
            </div>
            <button>create</button>
        </form>
    </div>
)

export default BlogForm