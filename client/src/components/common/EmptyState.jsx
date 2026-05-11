const EmptyState = ({ icon = '🐄', title = 'No data found', message, action }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
    <div className="text-6xl animate-float">{icon}</div>
    <div>
      <h3 className="text-lg font-display font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
      {message && <p className="text-sm text-gray-500 mt-1">{message}</p>}
    </div>
    {action}
  </div>
)
export default EmptyState
