import React, { useState } from 'react'
import "../auth.form.scss"
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const Register = () => {

  const navigate = useNavigate()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { loading, handleRegister } = useAuth()

  const handelSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setError("");
    const result = await handleRegister({ username, email, password });
    if (result.ok) navigate("/");
    else setError(result.message || "Registration failed.");
  };

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (password.match(/^(?=.*[A-Z])(?=.*[0-9])/)) return "Strong";
    return "Medium";
  };
  return (
    <main>
      <div className='form-container'>
        <h1>Create account 🚀</h1>
        <p className="subtitle">Start your journey with us</p>
        <form onSubmit={handelSubmit}>
          {error ? <p className="subtitle" style={{ color: "#c0392b", marginBottom: "0.75rem" }}>{error}</p> : null}
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              onChange={(e) => { setUsername(e.target.value) }}
              type="text" id='username' placeholder='Enter your name' />
          </div>

          <div className='input-group'>
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

            {password && (
              <p className={`strength ${getPasswordStrength(password).toLowerCase()}`}>
                {getPasswordStrength(password)}
              </p>
            )}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className="input-wrapper">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm password"
              />

              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button className='button primary-button' disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p>Already have an account? <Link to={"/login"}>Login</Link></p>
      </div>

    </main>
  )
}

export default Register
