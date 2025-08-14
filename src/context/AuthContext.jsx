import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '')
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || 'null') } catch { return null }
  })

  // Axios defaults
  useEffect(() => {
    axios.defaults.baseURL = import.meta.env.VITE_API_BASE || '/'
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  }, [token])

  const login = (token, user) => {
    setToken(token); setUser(user)
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
  }

  const logout = () => {
    setToken(''); setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  const value = useMemo(() => ({ token, user, login, logout }), [token, user])
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const useAuth = () => useContext(AuthCtx)
