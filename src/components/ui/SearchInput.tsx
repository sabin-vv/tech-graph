"use client"

import {
  forwardRef,
  useState,
  useEffect,
  useRef,
  InputHTMLAttributes,
} from "react"
import { Search, X, Loader2 } from "lucide-react"

interface SearchInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> {
  value?: string
  onChange?: (value: string) => void
  onItemSelect?: (value: string) => void
  onClear?: () => void
  fetchSuggestions?: (query: string) => Promise<string[]>
  placeholder?: string
  debounceMs?: number
}

const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      value: controlledValue,
      onChange,
      onItemSelect,
      onClear,
      fetchSuggestions,
      placeholder = "Search...",
      debounceMs = 300,
      className = "",
      disabled,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState<string>("")
    const [selected, setSelected] = useState<string>("")
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [open, setOpen] = useState<boolean>(false)
    const [error, setError] = useState<string>("")

    const isControlled = controlledValue !== undefined
    const value = isControlled ? controlledValue : internalValue

    const containerRef = useRef<HTMLDivElement>(null)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      if (!isControlled) {
        setInternalValue(newValue)
      }
      onChange?.(newValue)
    }

    const handleSelect = (suggestion: string) => {
      setSelected(suggestion)
      if (!isControlled) {
        setInternalValue("")
      }
      onChange?.("")
      onItemSelect?.(suggestion)
      setOpen(false)
      setSuggestions([])
    }

    const handleRemoveSelected = () => {
      setSelected("")
      onItemSelect?.("")
      onClear?.()
    }

    const handleClearInput = () => {
      if (!isControlled) {
        setInternalValue("")
      }
      onChange?.("")
      setOpen(false)
      setSuggestions([])
    }

    const showClear = value && value.length > 0

    useEffect(() => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }

      if (abortRef.current) {
        abortRef.current.abort()
      }

      if (!value || value.trim().length === 0 || !fetchSuggestions) {
        setSuggestions([])
        setLoading(false)
        setError("")
        return
      }

      setLoading(true)
      setError("")

      debounceRef.current = setTimeout(async () => {
        const controller = new AbortController()
        abortRef.current = controller
        try {
          const results = await fetchSuggestions(value)
          if (!controller.signal.aborted) {
            setSuggestions(results)
            setOpen(true)
          }
        } catch {
          if (!controller.signal.aborted) {
            setError("Failed to fetch suggestions")
            setSuggestions([])
          }
        } finally {
          if (!controller.signal.aborted) {
            setLoading(false)
          }
        }
      }, debounceMs)

      return () => {
        if (debounceRef.current) {
          clearTimeout(debounceRef.current)
        }
      }
    }, [value, fetchSuggestions, debounceMs])

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
        }
      }

      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [])

    return (
      <div className={`w-full ${className}`} ref={containerRef}>
        {selected && (
          <div className="mb-2 flex flex-wrap gap-2">
            <div className="border-border bg-primary-muted text-foreground inline-flex items-center gap-1 rounded-md border px-2 py-1 text-sm">
              <span>{selected}</span>
              <button
                type="button"
                onClick={handleRemoveSelected}
                className="text-text-secondary hover:text-foreground cursor-pointer rounded p-0.5 transition-colors"
                aria-label={`Remove ${selected}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <div className="relative w-full">
          <div className="text-text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2">
            <Search className="h-4 w-4" />
          </div>
          <input
            ref={ref}
            type="text"
            value={value}
            onChange={handleChange}
            onFocus={() => {
              if (suggestions.length > 0) setOpen(true)
            }}
            placeholder={placeholder}
            disabled={disabled}
            className="border-border bg-background-secondary text-foreground placeholder:text-text-muted focus:border-primary focus:ring-primary w-full rounded-md border py-2 pr-10 pl-10 text-sm shadow-sm transition-colors duration-150 focus:ring-2 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            {...props}
          />
          {loading ? (
            <div className="text-text-muted pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            showClear && (
              <button
                type="button"
                onClick={handleClearInput}
                className="text-text-secondary hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 cursor-pointer rounded p-1 transition-colors duration-150"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )
          )}

          {open && (loading || suggestions.length > 0 || error) && (
            <ul
              role="listbox"
              className="bg-surface-elevated border-border absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border py-1 shadow-lg focus:outline-none"
            >
              {loading && (
                <li className="text-text-muted px-3 py-2 text-sm">
                  Loading...
                </li>
              )}
              {!loading && error && (
                <li className="text-red-500 px-3 py-2 text-sm">{error}</li>
              )}
              {!loading && !error && suggestions.length === 0 && (
                <li className="text-text-muted px-3 py-2 text-sm">
                  No suggestions
                </li>
              )}
              {!loading &&
                !error &&
                suggestions.map((suggestion) => (
                  <li
                    key={suggestion}
                    role="option"
                    aria-selected="false"
                    onClick={() => handleSelect(suggestion)}
                    className="text-foreground hover:bg-surface-hover flex cursor-pointer items-center px-3 py-2 text-sm transition-colors duration-100"
                  >
                    {suggestion}
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    )
  },
)

SearchInput.displayName = "SearchInput"

export default SearchInput