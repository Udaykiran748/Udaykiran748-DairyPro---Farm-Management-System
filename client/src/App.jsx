import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import AppLayout from './components/layout/AppLayout'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Animals from './pages/Animals'
import Milk from './pages/Milk'
import Feeding from './pages/Feeding'
import Health from './pages/Health'
import Employees from './pages/Employees'
import Sales from './pages/Sales'
import Expenses from './pages/Expenses'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import About from './pages/About'
import Contact from './pages/Contact'
import Settings from './pages/Settings'
import Login from './pages/Login'
import Register from './pages/Register'
import Loader from './components/common/Loader'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading..." /></div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route index          element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="animals"   element={<Animals />} />
        <Route path="milk"      element={<Milk />} />
        <Route path="feeding"   element={<Feeding />} />
        <Route path="health"    element={<Health />} />
        <Route path="employees" element={<Employees />} />
        <Route path="sales"     element={<Sales />} />
        <Route path="expenses"  element={<Expenses />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports"   element={<Reports />} />
        <Route path="about"     element={<About />} />
        <Route path="contact"   element={<Contact />} />
        <Route path="settings"  element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
