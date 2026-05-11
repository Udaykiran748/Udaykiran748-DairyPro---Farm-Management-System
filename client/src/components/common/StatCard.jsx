import { motion } from 'framer-motion'

const StatCard = ({ icon, label, value, sub, color = 'green', trend }) => {
  const colors = {
    green:  { bg: 'bg-primary-50', icon: 'bg-primary-500', text: 'text-primary-700' },
    earth:  { bg: 'bg-earth-50',   icon: 'bg-earth-500',   text: 'text-earth-700' },
    blue:   { bg: 'bg-blue-50',    icon: 'bg-blue-500',    text: 'text-blue-700' },
    red:    { bg: 'bg-red-50',     icon: 'bg-red-500',     text: 'text-red-700' },
    purple: { bg: 'bg-purple-50',  icon: 'bg-purple-500',  text: 'text-purple-700' },
  }
  const c = colors[color] || colors.green
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 12px 40px rgba(22,163,74,0.12)' }}
      className="stat-card"
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 ${c.icon} rounded-xl flex items-center justify-center text-white text-2xl shadow-sm`}>
          {icon}
        </div>
        {trend !== undefined && (
          <span className={trend >= 0 ? 'text-green-600 text-xs font-medium' : 'text-red-500 text-xs font-medium'}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div>
        <div className="text-2xl font-display font-bold text-gray-800 dark:text-gray-100">{value}</div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-gray-400 mt-1">{sub}</div>}
      </div>
    </motion.div>
  )
}
export default StatCard
