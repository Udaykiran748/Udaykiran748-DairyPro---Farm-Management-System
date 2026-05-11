import { HiSearch } from 'react-icons/hi'
const SearchBar = ({ value, onChange, placeholder = 'Search...' }) => (
  <div className="relative">
    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text" value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="input-field pl-9 pr-4 py-2 text-sm"
    />
  </div>
)
export default SearchBar
