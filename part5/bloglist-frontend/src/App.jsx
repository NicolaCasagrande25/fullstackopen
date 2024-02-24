import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import Login from "./components/Login";
import LoggedInInfo from "./components/LoggedInInfo";
import CreateBlog from "./components/CreateBlog";
import blogService from "./services/blogs";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

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

  if (user === null) {
    return <Login setUser={setUser} />;
  }
  return (
    <div>
      <h2>blogs</h2>
      <LoggedInInfo user={user} setUser={setUser} />
      <CreateBlog blogs={blogs} setBlogs={setBlogs}/>
      {blogs.map((blog) => (
        <Blog key={blog.id} blog={blog} />
      ))}
    </div>
  );
};

export default App;
