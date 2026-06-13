import '../../styles/components.css'

const variants = {
  green:   'badge-green',
  yellow:  'badge-yellow',
  red:     'badge-red',
  blue:    'badge-blue',
  gray:    'badge-gray',
  purple:  'badge-purple',
}

const Badge = ({ label, color = 'green' }) => (
  <span className={`badge ${variants[color] || variants.gray}`}>
    {label}
  </span>
)

export default Badge
