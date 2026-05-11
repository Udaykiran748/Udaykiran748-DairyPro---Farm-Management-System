import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import toast from 'react-hot-toast'

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
    <div className="max-w-2xl space-y-6">
      <h1 className="page-title">Settings</h1>

      <div className="glass-card p-6">
        <h2 className="section-title mb-4">Profile</h2>
        <form onSubmit={handleProfile} className="space-y-4">
          {[{l:'Full Name',k:'name'},{l:'Phone',k:'phone',t:'tel'}].map(({l,k,t='text'})=>(
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{l}</label>
              <input type={t} value={profile[k]||''} onChange={e=>setProfile(p=>({...p,[k]:e.target.value}))} className="input-field" />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email (read-only)</label>
            <input value={user?.email||''} className="input-field opacity-60 cursor-not-allowed" readOnly />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Role</label>
            <input value={user?.role||''} className="input-field opacity-60 cursor-not-allowed capitalize" readOnly />
          </div>
          <button type="submit" disabled={saving} className="btn-primary">{saving?'Saving...':'Save Profile'}</button>
        </form>
      </div>

      <div className="glass-card p-6">
        <h2 className="section-title mb-4">Change Password</h2>
        <form onSubmit={handlePassword} className="space-y-4">
          {[{l:'Current Password',k:'currentPassword'},{l:'New Password',k:'newPassword'},{l:'Confirm New Password',k:'confirm'}].map(({l,k})=>(
            <div key={k}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{l}</label>
              <input type="password" value={passwords[k]} onChange={e=>setPasswords(p=>({...p,[k]:e.target.value}))} className="input-field" placeholder="••••••••" required />
            </div>
          ))}
          <button type="submit" disabled={saving} className="btn-primary">{saving?'Changing...':'Change Password'}</button>
        </form>
      </div>

      <div className="glass-card p-6">
        <h2 className="section-title mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-gray-800 dark:text-gray-100">{dark ? 'Dark Mode' : 'Light Mode'}</div>
            <div className="text-sm text-gray-500">Switch between dark and light theme</div>
          </div>
          <button onClick={toggle} className={`relative w-14 h-7 rounded-full transition-colors ${dark?'bg-primary-600':'bg-gray-300'}`}>
            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow transition-transform ${dark?'translate-x-8':'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  )
}
