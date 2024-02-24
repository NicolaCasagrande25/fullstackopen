const LoggedInInfo = ({ user, setUser, setMessage }) => {
  const handleLogout = () => {
    window.localStorage.removeItem("loggedBlogappUser");
    setUser(null);
    setMessage(`${user.name} logged out successfully`);
    setTimeout(() => {
      setMessage(null);
    }, 5000);
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