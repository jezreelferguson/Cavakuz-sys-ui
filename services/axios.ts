import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cavakuz-token') ?? sessionStorage.getItem('cavakuz-token')

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

export const setAuthToken = (token: string | null, persist = true) => {
  if (token) {
    if (persist) {
      localStorage.setItem('cavakuz-token', token)
      sessionStorage.setItem('cavakuz-token', token)
    } else {
      sessionStorage.setItem('cavakuz-token', token)
      localStorage.removeItem('cavakuz-token')
    }
    return
  }

  localStorage.removeItem('cavakuz-token')
  sessionStorage.removeItem('cavakuz-token')
}

export default api