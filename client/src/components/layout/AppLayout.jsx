import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pattern-farm">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Topbar onMenuToggle={() => setSidebarOpen(o => !o)} title={title} />
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
        <footer className="text-center py-4 text-xs text-gray-400 border-t border-gray-100 dark:border-gray-800">
          © 2025 DairyPro — Farm Management System. Built with 🌿 for farmers.
        </footer>
      </div>
      <Toaster position="top-right" toastOptions={{ className: 'text-sm font-medium' }} />
    </div>
  )
}
export default AppLayout
