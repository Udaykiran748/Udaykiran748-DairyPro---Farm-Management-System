import { HiMenu, HiBell, HiMoon, HiSun, HiSearch } from 'react-icons/hi'
import { useTheme } from '../../context/ThemeContext'
import { useState } from 'react'

const Topbar = ({ onMenuToggle, title }) => {
  const { dark, toggle } = useTheme()
  const [notif, setNotif] = useState(3)

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button onClick={onMenuToggle} className="topbar-menu-btn">
          <HiMenu style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        {/* We can re-use base elements like input */}
        <div style={{ position: 'relative', display: 'none' /* hidden on mobile */ }} className="md-flex-search">
          <HiSearch style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
          <input type="text" placeholder="Search..." style={{ paddingLeft: '2.25rem', width: '14rem' }} />
        </div>
        <button onClick={toggle} className="topbar-icon-btn">
          {dark ? <HiSun style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-warning)' }} /> : <HiMoon style={{ width: '1.25rem', height: '1.25rem' }} />}
        </button>
        <button className="topbar-icon-btn" style={{ position: 'relative' }}>
          <HiBell style={{ width: '1.25rem', height: '1.25rem' }} />
          {notif > 0 && (
            <span style={{ 
              position: 'absolute', top: '4px', right: '4px', 
              width: '16px', height: '16px', 
              backgroundColor: 'var(--color-danger)', color: 'white', 
              fontSize: '9px', fontWeight: 'bold', 
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' 
            }}>{notif}</span>
          )}
        </button>
      </div>
    </header>
  )
}
export default Topbar
