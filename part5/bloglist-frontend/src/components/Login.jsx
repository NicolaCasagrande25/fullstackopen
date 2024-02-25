import { useState } from 'react'
import loginService from '../services/login'
import blogService from '../services/blogs'

const Login = ({ setUser, setMessage, setIsError }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setMessage(`${user.name} logged in successfully`)
      setTimeout(() => {
        setMessage(null)
      }, 5000)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setIsError(true)
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
        setIsError(false)
      }, 5000)
    }
  }
  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>
          <span>username</span>
          <input
            type='text'
            value={username}
            name='Username'
            id='username'
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          <span>password</span>
          <input
            type='password'
            value={password}
            name='Password'
            id='password'
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type='submit' id='login-button'>login</button>
      </form>
    </div>
  )
}

export default Login
