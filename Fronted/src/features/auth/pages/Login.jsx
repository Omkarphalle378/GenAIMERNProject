import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Login = () => {

  const { loading, handleLogin } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("")
  const handelSubmit = async (e) => {
    e.preventDefault();
    setError("")
    if (!email?.trim() || !password) {
      setError("Please enter email and password")
      return
    }
    const result = await handleLogin({ email: email.trim(), password })
    if (result.ok) navigate("/")
    else setError(result.message || "Login failed.")
  }

  if (loading) {
    return (<main><h1>Loading......</h1></main>)
  }
  return (
    <main>
      <div className='form-container'>
        <h1>Welcome back 👋</h1>
        <p className="subtitle">Login to your account to continue</p>

        <form onSubmit={handelSubmit}>
          {error ? <p className="subtitle" style={{ color: "#c0392b", marginBottom: "0.75rem" }}>{error}</p> : null}
          <div className="input-group">
            <label htmlFor="email">Email</label>

            <input
              onChange={(e) => { setEmail(e.target.value) }}
              type="email" id='email' placeholder='Enter email address' />
          </div>

          <div className="input-group">
  <label htmlFor="password">Password</label>

  <div className="input-wrapper">
    <input
      onChange={(e) => setPassword(e.target.value)}
      type={showPassword ? "text" : "password"}
      id="password"
      placeholder="Enter password"
    />

    <span
      className="toggle-password"
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? "🙈" : "👁️"}
    </span>
  </div>
</div>

          <button type="submit" className='button primary-button'>Login</button>
        </form>

        <p>Don't have an account? <Link to={"/register"}>Register</Link></p>
      </div>
    </main>
  )
}

export default Login

