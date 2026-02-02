import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/Dashboard'
import Listening from './pages/modules/Listening'
import Speaking from './pages/modules/Speaking'
import Reading from './pages/modules/Reading'
import Writing from './pages/modules/Writing'
import Grammar from './pages/modules/Grammar'
import Vocabulary from './pages/modules/Vocabulary'
import CriticalThinking from './pages/modules/CriticalThinking'
import Pricing from './pages/Pricing'
import Landing from './pages/Landing'
import AdminDashboard from './pages/admin/AdminDashboard'
import StudentManagement from './pages/admin/StudentManagement'
import Reports from './pages/admin/Reports'
import QuestionManagement from './pages/admin/QuestionManagement'

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return isAuthenticated ? children : <Navigate to="/login" />
}

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/pricing" element={<Pricing />} />

      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="listening" element={<Listening />} />
        <Route path="speaking" element={<Speaking />} />
        <Route path="reading" element={<Reading />} />
        <Route path="writing" element={<Writing />} />
        <Route path="grammar" element={<Grammar />} />
        <Route path="vocabulary" element={<Vocabulary />} />
        <Route path="critical-thinking" element={<CriticalThinking />} />

        {/* Admin Routes */}
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="admin/students" element={<StudentManagement />} />
        <Route path="admin/reports" element={<Reports />} />
        <Route path="admin/questions" element={<QuestionManagement />} />
      </Route>
    </Routes>
  )
}
