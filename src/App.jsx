import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import LoginPage from './pages/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

function TopBar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  return (
    <div className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-semibold tracking-tight">Puntored Admin</Link>
        <div className="flex items-center gap-3">
          {user && (
            <div className="text-sm text-slate-600">
              <div className="font-medium">{user.username}</div>
              <div className="text-xs">{user.roles}</div>
            </div>
          )}
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="rounded-lg border px-3 py-1.5 text-sm hover:bg-slate-50"
          >
            Salir
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <TopBar />
        <div className="flex-1">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}
