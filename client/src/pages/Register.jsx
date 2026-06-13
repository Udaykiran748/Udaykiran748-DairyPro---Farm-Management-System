import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HiMail, HiLockClosed, HiUser, HiPhone } from 'react-icons/hi'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import '../styles/Auth.css'

const ROLES = ['admin', 'farmer', 'worker', 'accountant']

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'farmer', phone: '' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const up = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await register({ name: form.name, email: form.email, password: form.password, role: form.role, phone: form.phone })
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
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
            <h2 className="auth-quote">"Join our community of modern farmers leveraging technology for better yields."</h2>
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
          <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
            <div className="auth-icon-wrapper" style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem' }}>
              <span className="auth-icon" style={{ fontSize: '1.5rem' }}>🌾</span>
            </div>
            <h1 className="auth-title">Create Account</h1>
            <p className="auth-subtitle">Join DairyPro today</p>
          </div>
          <form onSubmit={handleSubmit} className="auth-form" style={{ gap: '1rem' }}>
            {[
              { key: 'name', label: 'Full Name', icon: HiUser, type: 'text', placeholder: 'Ramesh Kumar' },
              { key: 'email', label: 'Email', icon: HiMail, type: 'email', placeholder: 'you@farm.com' },
              { key: 'phone', label: 'Phone', icon: HiPhone, type: 'tel', placeholder: '9876543210' },
              { key: 'password', label: 'Password', icon: HiLockClosed, type: 'password', placeholder: '••••••••' },
              { key: 'confirm', label: 'Confirm Password', icon: HiLockClosed, type: 'password', placeholder: '••••••••' },
            ].map(({ key, label, icon: Icon, type, placeholder }) => (
              <div key={key} className="auth-form-group">
                <label className="auth-label">{label}</label>
                <div className="auth-input-wrapper">
                  <input type={type} value={form[key]} onChange={e => up(key, e.target.value)}
                    className="auth-input" placeholder={placeholder} required />
                  <Icon className="auth-input-icon" />
                </div>
              </div>
            ))}
            <div className="auth-form-group">
              <label className="auth-label">Role</label>
              <select value={form.role} onChange={e => up('role', e.target.value)} className="auth-input" style={{ paddingLeft: '1rem' }}>
                {ROLES.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="auth-submit-btn" style={{ marginTop: '0.5rem' }}>
              {loading ? <div className="spinner" /> : null}
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer" style={{ marginTop: '1.5rem' }}>
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
