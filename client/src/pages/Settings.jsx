import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'
import '../styles/Settings.css'

export default function Settings() {
  const { dark, toggle } = useTheme()
  const { user } = useAuth()
  const [profile, setProfile] = useState({ name: user?.name||'', phone: user?.phone||'' })
  const [passwords, setPasswords] = useState({ currentPassword:'', newPassword:'', confirm:'' })
  const [saving, setSaving] = useState(false)

  const handleProfile = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await api.put('/auth/profile', profile); toast.success('Profile updated!') }
    catch { toast.error('Failed to update') }
    finally { setSaving(false) }
  }

  const handlePassword = async (e) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirm) return toast.error('Passwords do not match')
    setSaving(true)
    try { await api.put('/auth/password', {currentPassword:passwords.currentPassword,newPassword:passwords.newPassword}); toast.success('Password changed!'); setPasswords({currentPassword:'',newPassword:'',confirm:''}) }
    catch { toast.error('Failed to change password') }
    finally { setSaving(false) }
  }

  return (
    <div className="settings-page">
      <h1 className="settings-title">Settings</h1>

      <div className="card settings-card">
        <h2 className="section-title">Profile</h2>
        <form onSubmit={handleProfile} className="settings-form">
          {[{l:'Full Name',k:'name'},{l:'Phone',k:'phone',t:'tel'}].map(({l,k,t='text'})=>(
            <div className="form-group" key={k}>
              <label className="form-label">{l}</label>
              <input type={t} value={profile[k]||''} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))} style={{ width: '100%' }} />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Email (read-only)</label>
            <input value={user?.email||''} style={{ width: '100%' }} className="input-readonly" readOnly />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <input value={user?.role||''} style={{ width: '100%' }} className="input-readonly input-capitalize" readOnly />
          </div>
          <button type="submit" disabled={saving} className="btn btn-primary form-submit-btn">{saving?'Saving...':'Save Profile'}</button>
        </form>
      </div>

      <div className="card settings-card">
        <h2 className="section-title">Change Password</h2>
        <form onSubmit={handlePassword} className="settings-form">
          {[{l:'Current Password',k:'currentPassword'},{l:'New Password',k:'newPassword'},{l:'Confirm New Password',k:'confirm'}].map(({l,k})=>(
            <div className="form-group" key={k}>
              <label className="form-label">{l}</label>
              <input type="password" value={passwords[k]} onChange={e=>setPasswords(p=>({...p,[k]:e.target.value}))} style={{ width: '100%' }} placeholder="••••••••" required />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn btn-primary form-submit-btn">{saving?'Changing...':'Change Password'}</button>
        </form>
      </div>

      <div className="card settings-card">
        <h2 className="section-title">Appearance</h2>
        <div className="appearance-row">
          <div className="appearance-info">
            <div className="appearance-label">{dark ? 'Dark Mode' : 'Light Mode'}</div>
            <div className="appearance-desc">Switch between dark and light theme</div>
          </div>
          <button onClick={toggle} className={`theme-toggle-btn ${dark?'theme-toggle-dark':'theme-toggle-light'}`}>
            <div className={`theme-toggle-circle ${dark?'theme-toggle-circle-dark':'theme-toggle-circle-light'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
