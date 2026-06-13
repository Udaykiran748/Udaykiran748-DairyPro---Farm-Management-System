import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import '../../styles/layout.css'

const PAGE_TITLES = {
  '/': 'Home', '/dashboard': 'Dashboard', '/animals': 'Animal Management',
  '/milk': 'Milk Production', '/feeding': 'Feeding Schedule', '/health': 'Health Records',
  '/employees': 'Employees', '/sales': 'Sales & Billing', '/expenses': 'Expenses',
  '/inventory': 'Inventory', '/reports': 'Reports & Analytics', '/about': 'About Farm',
  '/contact': 'Contact', '/settings': 'Settings',
}

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = PAGE_TITLES[pathname] || 'DairyPro'

  useEffect(() => setSidebarOpen(false), [pathname])

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-main-wrapper">
        <Topbar onMenuToggle={() => setSidebarOpen(o => !o)} title={title} />
        <main className="app-main-content">
          <Outlet />
        </main>
        <footer className="app-footer">
          © 2025 DairyPro — Farm Management System. Built with 🌿 for farmers.
        </footer>
      </div>
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
    </div>
  )
}
export default AppLayout
