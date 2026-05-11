import { NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import {
  HiHome, HiViewGrid, HiStar, HiBeaker, HiHeart, HiUsers,
  HiShoppingCart, HiCurrencyRupee, HiArchive, HiChartBar,
  HiLogout, HiCog, HiPhone, HiInformationCircle
} from 'react-icons/hi'
import { MdGrass } from 'react-icons/md'
import toast from 'react-hot-toast'

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

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />}
      <motion.aside
        initial={false}
        animate={{ x: open ? 0 : -280 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-950 border-r border-gray-100 dark:border-gray-800 z-40 flex flex-col shadow-xl lg:translate-x-0 lg:shadow-none"
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center text-xl shadow-md">
              🐄
            </div>
            <div>
              <h1 className="font-display font-bold text-gray-900 dark:text-white text-lg leading-none">DairyPro</h1>
              <p className="text-xs text-gray-400 mt-0.5">Farm Management</p>
            </div>
          </div>
        </div>

        {/* User */}
        <div className="px-5 py-3 bg-primary-50 dark:bg-primary-950/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
              <p className="text-xs text-primary-600 dark:text-primary-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto scrollbar-thin space-y-0.5">
          {NAV.map((item, i) => {
            if (item.divider) return (
              <div key={i} className="pt-4 pb-1.5 px-1">
                <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">{item.label}</p>
              </div>
            )
            const Icon = item.icon
            return (
              <NavLink key={item.to} to={item.to} end={item.to === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} onClick={onClose}>
            <HiCog className="w-4 h-4" /><span>Settings</span>
          </NavLink>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30">
            <HiLogout className="w-4 h-4" /><span>Logout</span>
          </button>
        </div>
      </motion.aside>
    </>
  )
}
export default Sidebar
