import { HiSearch } from 'react-icons/hi'
import '../../styles/components.css'

const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="searchbar-wrapper">
    <HiSearch className="searchbar-icon" style={{ width: '1rem', height: '1rem' }} />
    <input
      type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field searchbar-input"
    />
  </div>
)

export default SearchBar
