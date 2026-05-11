const Table = ({ headers, children, empty = 'No records found' }) => (
  <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700">
    <table className="w-full text-sm">
      <thead>
        <tr className="bg-primary-50 dark:bg-gray-800">
          {headers.map((h, i) => (
            <th key={i} className="px-4 py-3 text-left text-xs font-semibold text-primary-700 dark:text-primary-300 uppercase tracking-wider">{h}</th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-50 dark:divide-gray-800">
        {children}
      </tbody>
    </table>
    {!children || (Array.isArray(children) && children.length === 0) ? (
      <div className="text-center py-12 text-gray-400 dark:text-gray-600">{empty}</div>
    ) : null}
  </div>
)
export default Table
