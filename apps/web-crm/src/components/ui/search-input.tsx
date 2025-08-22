"use client"

import * as React from "react"
import { Search, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchResult {
  id: string
  title: string
  description?: string
  category?: string
  url?: string
}

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  onResultSelect?: (result: SearchResult) => void
  results?: SearchResult[]
  loading?: boolean
  debounceMs?: number
  showClearButton?: boolean
  className?: string
  variant?: "default" | "ghost" | "filled"
}

export function SearchInput({
  placeholder = "Search...",
  value: controlledValue,
  onChange,
  onSearch,
  onResultSelect,
  results = [],
  loading = false,
  debounceMs = 300,
  showClearButton = true,
  className,
  variant = "default"
}: SearchInputProps) {
  const [value, setValue] = React.useState(controlledValue || "")
  const [isOpen, setIsOpen] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const resultsRef = React.useRef<HTMLDivElement>(null)

  // Debounced search
  React.useEffect(() => {
    if (!value.trim()) {
      setIsOpen(false)
      return
    }

    const timer = setTimeout(() => {
      onSearch?.(value)
      if (results.length > 0) {
        setIsOpen(true)
      }
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs, onSearch])

  // Controlled vs uncontrolled
  React.useEffect(() => {
    if (controlledValue !== undefined) {
      setValue(controlledValue)
    }
  }, [controlledValue])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onChange?.(newValue)
    setHighlightedIndex(-1)
  }

  const handleClear = () => {
    setValue("")
    onChange?.("")
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const handleResultSelect = (result: SearchResult) => {
    setValue(result.title)
    onChange?.(result.title)
    onResultSelect?.(result)
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter") {
        onSearch?.(value)
      }
      return
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        )
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1)
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          handleResultSelect(results[highlightedIndex])
        } else {
          onSearch?.(value)
          setIsOpen(false)
        }
        break
      case "Escape":
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }

  const variantClasses = {
    default: "border border-input",
    ghost: "border-0 bg-transparent",
    filled: "border-0 bg-muted"
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className={cn(
            "pl-10",
            showClearButton && value && "pr-20",
            variantClasses[variant]
          )}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          {showClearButton && value && !loading && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 z-50 mt-2 max-h-64 overflow-auto rounded-md border bg-popover shadow-lg"
        >
          {results.map((result, index) => (
            <div
              key={result.id}
              onClick={() => handleResultSelect(result)}
              className={cn(
                "cursor-pointer px-4 py-3 text-sm hover:bg-accent",
                index === highlightedIndex && "bg-accent"
              )}
            >
              <div className="font-medium">{result.title}</div>
              {result.description && (
                <div className="text-muted-foreground text-xs mt-1 line-clamp-2">
                  {result.description}
                </div>
              )}
              {result.category && (
                <div className="text-xs text-primary mt-1">{result.category}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Quick Search Hook
export function useQuickSearch<T>(
  items: T[],
  searchFields: (keyof T)[],
  debounceMs = 300
) {
  const [query, setQuery] = React.useState("")
  const [results, setResults] = React.useState<T[]>([])

  React.useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const timer = setTimeout(() => {
      const filtered = items.filter(item =>
        searchFields.some(field => {
          const value = item[field]
          return typeof value === 'string' && 
                 value.toLowerCase().includes(query.toLowerCase())
        })
      )
      setResults(filtered.slice(0, 10)) // Limit to 10 results
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [query, items, searchFields, debounceMs])

  return { query, setQuery, results }
}
