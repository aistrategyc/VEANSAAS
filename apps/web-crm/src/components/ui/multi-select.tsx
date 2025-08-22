"use client"

import * as React from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"

interface MultiSelectOption {
  label: string
  value: string
  disabled?: boolean
}

interface MultiSelectProps {
  options: MultiSelectOption[]
  value?: string[]
  onValueChange?: (value: string[]) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  maxSelected?: number
  disabled?: boolean
  className?: string
  variant?: "default" | "tags" | "compact"
}

export function MultiSelect({
  options,
  value = [],
  onValueChange,
  placeholder = "Select items...",
  searchPlaceholder = "Search...",
  emptyText = "No options found",
  maxSelected,
  disabled = false,
  className,
  variant = "default"
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedOptions = options.filter(option => value.includes(option.value))
  const availableOptions = options.filter(option => !value.includes(option.value))

  const filteredOptions = availableOptions.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    
    onValueChange?.(newValue)
  }

  const handleRemove = (optionValue: string) => {
    onValueChange?.(value.filter(v => v !== optionValue))
  }

  const handleClear = () => {
    onValueChange?.([])
  }

  const isMaxReached = maxSelected ? value.length >= maxSelected : false

  if (variant === "tags") {
    return (
      <div className={cn("space-y-2", className)}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="justify-between w-full"
              disabled={disabled || isMaxReached}
            >
              {isMaxReached ? `${maxSelected} selected` : "Add tags..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder={searchPlaceholder}
                value={search}
                onValueChange={setSearch}
              />
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup className="max-h-64 overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>

        {selectedOptions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {option.label}
                <button
                  type="button"
                  onClick={() => handleRemove(option.value)}
                  className="ml-1 hover:bg-muted rounded-full"
                  disabled={disabled}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    )
  }

  if (variant === "compact") {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn("justify-between", className)}
            disabled={disabled}
          >
            <span className="truncate">
              {value.length === 0
                ? placeholder
                : `${value.length} selected`
              }
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0">
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  onSelect={() => handleSelect(option.value)}
                  disabled={option.disabled}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value.includes(option.value) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
            {value.length > 0 && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="w-full"
                >
                  Clear all
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    )
  }

  // Default variant
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between min-h-10", className)}
          disabled={disabled}
        >
          <div className="flex flex-wrap gap-1 flex-1">
            {value.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              selectedOptions.slice(0, 3).map((option) => (
                <Badge key={option.value} variant="secondary" className="text-xs">
                  {option.label}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(option.value)
                    }}
                    className="ml-1 hover:bg-muted rounded-full"
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))
            )}
            {value.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{value.length - 3} more
              </Badge>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandEmpty>{emptyText}</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            {filteredOptions.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                disabled={option.disabled || (isMaxReached && !value.includes(option.value))}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
          {value.length > 0 && (
            <div className="border-t p-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                {value.length} selected
                {maxSelected && ` of ${maxSelected}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
              >
                Clear all
              </Button>
            </div>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  )
}
