import { useState } from "react";

const Blog = ({ blog, user, likeBlog, removeBlog }) => {
  const [showDetails, setShowDetails] = useState(false);

  const hideWhenVisible = { display: showDetails ? "none" : "" };
  const showWhenVisible = { display: showDetails ? "" : "none" };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  const removeButtonStyle = {
    backgroundColor: "#FF3838",
    color: "white",
    border: "none",
    padding: "5px",
    borderRadius: "5px",
  };

  const confirmBlogRemoval = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      removeBlog(blog);
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button style={hideWhenVisible} onClick={() => setShowDetails(true)}>
        view
      </button>
      <button style={showWhenVisible} onClick={() => setShowDetails(false)}>
        hide
      </button>
      <div style={showWhenVisible}>
        <span>{blog.url}</span>
        <div>
          likes {blog.likes}
          <button
            onClick={() => {
              likeBlog(blog);
            }}
          >
            like
          </button>
        </div>
        <div>{blog.creator.name}</div>
        {blog.creator.username === user.username && <button onClick={confirmBlogRemoval} style={removeButtonStyle}>remove</button>}
      </div>
    </div>
  );
};

export default Blog;
