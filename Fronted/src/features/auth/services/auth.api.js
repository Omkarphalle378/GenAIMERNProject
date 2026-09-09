import axios from "axios"

export const AUTH_TOKEN_KEY = "mern_project_auth_token"

/** In dev, use same-origin `/api` so Vite proxies to the backend (avoids CORS / blocked cookies). */
function resolveApiBaseURL() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL
  if (fromEnv != null && String(fromEnv).trim() !== "") {
    return String(fromEnv).replace(/\/$/, "")
  }
  if (import.meta.env.DEV) {
    return ""
  }
  return "https://hiresmart-backend-lhwv.onrender.com"
}

export const api = axios.create({
  baseURL: resolveApiBaseURL(),
  withCredentials: true,
  timeout: 30000,
})

api.interceptors.request.use((config) => {
  const t = localStorage.getItem(AUTH_TOKEN_KEY)
  if (t) {
    config.headers.Authorization = `Bearer ${t}`
  }
  return config
})

export function setAuthToken(token) {
  if (token) localStorage.setItem(AUTH_TOKEN_KEY, token)
  else localStorage.removeItem(AUTH_TOKEN_KEY)
}

export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password
  })
  return response.data
}

export async function login({ email, password }) {
  const response = await api.post("/api/auth/login", {
    email,
    password
  })
  return response.data
}

export async function logout() {
  const response = await api.post("/api/auth/logout")
  return response.data
}

export async function getMe() {
  const response = await api.get("/api/auth/get-me")
  return response.data
}
