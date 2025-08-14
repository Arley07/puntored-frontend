import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { loginRequest } from '../api/auth.js'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123*')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const data = await loginRequest(username, password)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.error || 'Error de autenticación')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 w-full max-w-sm">
      <div>
        <label className="block text-sm font-medium mb-1">Usuario</label>
        <input
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="admin"
          autoComplete="username"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Contraseña</label>
        <input
          type="password"
          className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-indigo-600 text-white py-2.5 hover:bg-indigo-700 disabled:opacity-60"
      >
        {loading ? 'Ingresando…' : 'Ingresar'}
      </button>
    </form>
  )
}
