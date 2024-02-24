import { useState, useEffect, useRef } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import LoggedInInfo from "./components/LoggedInInfo";
import CreateBlog from "./components/CreateBlog";
import Notification from "./components/Notification";
import Togglable from "./components/togglable";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const blogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then((returnedBlog) => {
      const userId = returnedBlog.creator;
      const newBlogWithCreator = {
        ...returnedBlog,
        creator: {
          username: user.username,
          name: user.name,
          id: userId,
        },
      };
      setBlogs(blogs.concat(newBlogWithCreator));
      setMessage(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      );
      setTimeout(() => {
        setMessage(null);
      }, 5000);
    });
  };

  const likeBlog = (blog) => {
    const updatedBlog = {
      ...blog,
      creator: blog.creator.id,
      likes: blog.likes + 1,
    };
    delete updatedBlog.id;
    blogService.update(blog.id, updatedBlog).then((returnedBlog) => {
      setBlogs(
        blogs.map((b) => (b.id !== returnedBlog.id ? b : returnedBlog))
      );
    });
  };
  if (user === null) {
    return (
      <div>
        <h2>log in to application</h2>
        <Notification message={message} isError={isError} />
        <Login
          setUser={setUser}
          setMessage={setMessage}
          setIsError={setIsError}
        />
      </div>
    );
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} isError={isError} />
      <LoggedInInfo user={user} setUser={setUser} setMessage={setMessage} />
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlog createBlog={createBlog} />
      </Togglable>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} />
      ))}
    </div>
  );
};

export default App;
