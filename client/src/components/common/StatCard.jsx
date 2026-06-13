import { motion } from 'framer-motion'
import '../../styles/components.css'

const StatCard = ({ icon, label, value, sub, color = 'green', trend }) => {
  const colors = {
    green:  'stat-bg-green',
    earth:  'stat-bg-earth',
    blue:   'stat-bg-blue',
    red:    'stat-bg-red',
    purple: 'stat-bg-purple',
  }
  
  const iconClass = colors[color] || colors.green

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(22,163,74,0.12)' }}
      className="stat-card"
    >
      <div className="stat-card-header">
        <div className={`stat-card-icon ${iconClass}`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={`stat-trend ${trend >= 0 ? 'stat-trend-up' : 'stat-trend-down'}`}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </motion.div>
  )
}

export default StatCard
