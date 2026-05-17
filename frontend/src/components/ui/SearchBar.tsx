import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, X } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  autoFocus?: boolean
  initialValue?: string
}

export default function SearchBar({ onSearch, placeholder = 'Search games...', autoFocus = false, initialValue = '' }: SearchBarProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      onSearch(newValue)
    }, 400)
  }, [onSearch])

  const handleClear = useCallback(() => {
    setValue('')
    onSearch('')
    inputRef.current?.focus()
  }, [onSearch])

  return (
    <div className="relative group">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-500 group-focus-within:text-accent-400 transition-colors" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3.5 bg-surface-900 border-2 border-surface-700 rounded-2xl text-surface-100 placeholder-surface-500 focus:border-accent-500 focus:outline-none transition-all duration-200 text-base"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-surface-500 hover:text-surface-300 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}
    </div>
  )
}
