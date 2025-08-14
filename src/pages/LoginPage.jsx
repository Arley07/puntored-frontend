import React from 'react'
import LoginForm from '../components/LoginForm.jsx'

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border rounded-2xl p-6 shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-semibold">Acceso Administrador</h1>
          <p className="text-slate-500 text-sm">Ingresa con tus credenciales</p>
        </div>
        <LoginForm />
        <p className="text-xs text-slate-400 mt-4">Usuario demo: <span className="font-mono">admin / admin123*</span></p>
      </div>
    </div>
  )
}
