import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { getMe, login, logout, register, setAuthToken, AUTH_TOKEN_KEY } from "../services/auth.api";
import { getAuthErrorMessage } from "../utils/authErrors";


export const useAuth = () => {
  const context = useContext(AuthContext)
  const { user, setUser, loading, setLoading } = context

  const handleLogin = async ({ email, password }) => {
    setLoading(true)
    try {
      const data = await login({ email, password })
      if (data?.token) setAuthToken(data.token)
      if (data?.user) {
        setUser(data.user)
        return { ok: true }
      }
    } catch (err) {
      console.log(err)
      setAuthToken(null)
      return { ok: false, message: getAuthErrorMessage(err, "Login failed") }
    } finally {
      setLoading(false)
    }
    return { ok: false, message: "Login failed" }
  }

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true)
    try {
      const data = await register({ username, email, password })
      if (data?.token) setAuthToken(data.token)
      if (data?.user) {
        setUser(data.user)
        return { ok: true }
      }
    } catch (err) {
      console.log(err)
      setAuthToken(null)
      return { ok: false, message: getAuthErrorMessage(err, "Registration failed") }
    } finally {
      setLoading(false)
    }
    return { ok: false, message: "Registration failed" }
  }

  const handleLogout = async () => {
    setLoading(true)
    try {
      await logout()
    } catch (err) {
      console.log(err)
    } finally {
      setAuthToken(null)
      setUser(null)
      setLoading(false)
    }
  }

  useEffect(() => {
    const getAndSetUser = async () => {
      const stored = localStorage.getItem(AUTH_TOKEN_KEY)
      if (!stored) {
        setLoading(false)
        return
      }
      try {
        const data = await getMe()
        if (data?.user) {
          setUser(data.user)
        } else {
          setAuthToken(null)
        }
      } catch (err) {
        console.log(err)
        setAuthToken(null)
      } finally {
        setLoading(false)
      }
    }

    getAndSetUser()
  }, [])

  return { user, loading, handleLogin, handleRegister, handleLogout }
}
