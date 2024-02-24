const LoggedInInfo = ({ user, setUser }) => {
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
  };
  return (
    <div>
      <span>{user.name} logged in</span>
      <button onClick={handleLogout}>logout</button>
      <br />
      <br />
    </div>
  );
};

export default LoggedInInfo;