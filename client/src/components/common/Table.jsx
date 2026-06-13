import '../../styles/components.css'

const Table = ({ headers, children, empty = 'No records found' }) => (
  <div className="table-container">
    <table className="table-wrapper">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {children}
      </tbody>
    </table>
    {!children || (Array.isArray(children) && children.length === 0) ? (
      <div className="table-empty">{empty}</div>
    ) : null}
  </div>
)

export default Table
