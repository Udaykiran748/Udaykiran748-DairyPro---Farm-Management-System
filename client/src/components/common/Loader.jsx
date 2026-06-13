import '../../styles/components.css'

const Loader = ({ text = 'Loading...' }) => (
  <div className="loader-container">
    <div className="loader-spinner" />
    <p className="loader-text">{text}</p>
  </div>
)

export default Loader
