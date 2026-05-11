import { HiMenu, HiBell, HiMoon, HiSun, HiSearch } from 'react-icons/hi'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'

const Topbar = ({ onMenuToggle, title }) => {
  const { dark, toggle } = useTheme()
  const [notif, setNotif] = useState(3)

  return (
    <header className="sticky top-0 z-20 bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button onClick={onMenuToggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors lg:hidden">
          <HiMenu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="font-display font-semibold text-gray-800 dark:text-gray-100 text-lg">{title}</h2>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input type="text" placeholder="Search..." className="input-field text-sm pl-9 py-2 w-56" />
        </div>
        <button onClick={toggle} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          {dark ? <HiSun className="w-5 h-5 text-yellow-400" /> : <HiMoon className="w-5 h-5 text-gray-600" />}
        </button>
        <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          <HiBell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          {notif > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notif}</span>
          )}
        </button>
      </div>
    </header>
  )
}
export default Topbar
