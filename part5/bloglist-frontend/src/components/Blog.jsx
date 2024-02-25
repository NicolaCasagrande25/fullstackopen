import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, user, likeBlog, removeBlog }) => {

  Blog.propTypes = {
    blog: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    likeBlog: PropTypes.func.isRequired,
    removeBlog: PropTypes.func.isRequired,
  }

  const [showDetails, setShowDetails] = useState(false)

  const hideWhenVisible = { display: showDetails ? 'none' : '' }
  const showWhenVisible = { display: showDetails ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const removeButtonStyle = {
    backgroundColor: '#FF3838',
    color: 'white',
    border: 'none',
    padding: '5px',
    borderRadius: '5px',
  }

  const confirmBlogRemoval = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog)
    }
  }

  return (
    <div style={blogStyle} className="blog">
      <div className='title-author-div'>
        {blog.title} {blog.author}
        <button style={hideWhenVisible} onClick={() => setShowDetails(true)}>
        view
        </button>
        <button style={showWhenVisible} onClick={() => setShowDetails(false)}>
        hide
        </button>
      </div>
      <div style={showWhenVisible} className='url-likes-div'>
        <span>{blog.url}</span>
        <div>
          likes {blog.likes}
          <button
            onClick={() => {
              likeBlog(blog)
            }}
          >
            like
          </button>
        </div>
        <div>{blog.creator.name}</div>
        {blog.creator.username === user.username && <button onClick={confirmBlogRemoval} style={removeButtonStyle}>remove</button>}
      </div>
    </div>
  )
}

export default Blog
