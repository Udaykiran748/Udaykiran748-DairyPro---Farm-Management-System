import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  HiHome, HiViewGrid, HiStar, HiBeaker, HiHeart, HiUsers,
  HiShoppingCart, HiCurrencyRupee, HiArchive, HiChartBar,
  HiLogout, HiCog, HiPhone, HiInformationCircle
} from 'react-icons/hi'
import { MdGrass } from 'react-icons/md'
import toast from 'react-hot-toast'
import ConfirmDialog from '../common/ConfirmDialog'

const NAV = [
  { label: 'Home', to: '/', icon: HiHome },
  { label: 'Dashboard', to: '/dashboard', icon: HiViewGrid },
  { divider: true, label: 'FARM MANAGEMENT' },
  { label: 'Animals', to: '/animals', icon: HiStar },
  { label: 'Milk Production', to: '/milk', icon: HiBeaker },
  { label: 'Feeding', to: '/feeding', icon: MdGrass },
  { label: 'Health Records', to: '/health', icon: HiHeart },
  { divider: true, label: 'BUSINESS' },
  { label: 'Employees', to: '/employees', icon: HiUsers },
  { label: 'Sales & Billing', to: '/sales', icon: HiShoppingCart },
  { label: 'Expenses', to: '/expenses', icon: HiCurrencyRupee },
  { label: 'Inventory', to: '/inventory', icon: HiArchive },
  { label: 'Reports', to: '/reports', icon: HiChartBar },
  { divider: true, label: 'INFO' },
  { label: 'About Farm', to: '/about', icon: HiInformationCircle },
  { label: 'Contact', to: '/contact', icon: HiPhone },
]

const Sidebar = ({ open, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <>
      {open && <div className="sidebar-overlay" onClick={onClose} />}
      <aside
        className="sidebar"
        style={{ transform: open ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-icon">🐄</div>
          <div>
            <h1 className="sidebar-logo-text">DairyPro</h1>
            <p className="sidebar-logo-sub">Farm Management</p>
          </div>
        </div>

        <div className="sidebar-user-container">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <p className="sidebar-user-name">{user?.name}</p>
            <p className="sidebar-user-role">{user?.role}</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {NAV.map((item, i) => {
            if (item.divider) return (
              <div key={i} className="sidebar-nav-divider">{item.label}</div>
            )
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon style={{ width: '1.25rem', height: '1.25rem' }} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-bottom">
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <HiCog style={{ width: '1.25rem', height: '1.25rem' }} /><span>Settings</span>
          </NavLink>
          <button onClick={() => setShowLogoutConfirm(true)} className="sidebar-link sidebar-link-danger">
            <HiLogout style={{ width: '1.25rem', height: '1.25rem' }} /><span>Logout</span>
          </button>
        </div>
      </aside>

      <ConfirmDialog 
        isOpen={showLogoutConfirm} 
        onClose={() => setShowLogoutConfirm(false)} 
        onConfirm={handleLogout} 
        title="Confirm Logout" 
        message="Are you sure you want to log out of your account?" 
      />
    </>
  )
}
export default Sidebar
