import '../../styles/components.css'

const EmptyState = ({ icon = '🐄', title = 'No data found', message, action }) => (
  <div className="empty-state">
    <div className="empty-icon">{icon}</div>
    <div>
      <h3 className="empty-title">{title}</h3>
      {message && <p className="empty-message">{message}</p>}
    </div>
    {action}
  </div>
)

export default EmptyState
