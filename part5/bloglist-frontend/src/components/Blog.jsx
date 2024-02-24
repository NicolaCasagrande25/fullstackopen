import { useState } from "react";

const Blog = ({ blog }) => {
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
              console.log(`you liked ${blog.title} by ${blog.author}`);
            }}
          >
            like
          </button>
        </div>
        <div>{blog.creator.name}</div>
      </div>
    </div>
  );
};

export default Blog;
