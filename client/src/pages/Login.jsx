import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiLockClosed, HiEye, HiEyeOff, HiSparkles } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Auth.css'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(form.email, form.password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout">
      <div className="auth-image-side">
        <div className="auth-image-overlay">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}>
            <div className="auth-brand-badge">DairyPro App</div>
            <h2 className="auth-quote">"Empowering modern dairy farms with smart technology and sustainable practices."</h2>
            <p className="auth-quote-author">— The Future of Farm Management</p>
          </motion.div>
        </div>
      </div>
      
      <div className="auth-form-side">
        <motion.div 
          initial={{ opacity: 0, x: 20 }} 
          animate={{ opacity: 1, x: 0 }} 
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} 
          className="auth-form-container"
        >
          <div className="auth-header">
            <div className="auth-icon-wrapper">
              <span className="auth-icon">🐄</span>
            </div>
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-form-group">
              <label className="auth-label">Email Address</label>
              <div className="auth-input-wrapper">
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="auth-input" placeholder="admin@farm.com" required />
                <HiMail className="auth-input-icon" />
              </div>
            </div>
            <div className="auth-form-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <input type={showPass ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="auth-input" style={{ paddingRight: '3rem' }} placeholder="••••••••" required />
                <HiLockClosed className="auth-input-icon" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="auth-input-action">
                  {showPass ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>

            <div className="auth-demo-box">
              <HiSparkles style={{ color: '#059669', width: '1.25rem', height: '1.25rem' }} />
              <span><strong>Demo Account:</strong> admin@farm.com / admin123</span>
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? <div className="spinner" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">Create one now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
