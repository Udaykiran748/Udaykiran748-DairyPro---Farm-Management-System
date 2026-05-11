const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
    <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
  </div>
)
export default Loader
