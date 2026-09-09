"use client"

import { forwardRef, useState, useRef, useEffect, ReactNode } from "react"
import { ChevronDown, Check } from "lucide-react"

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
}

interface SelectProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  leftIcon?: ReactNode
}

const Select = forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      options = [],
      placeholder = "Select an option",
      value,
      onChange,
      className = "",
      id,
      leftIcon,
      ...props
    },
    ref,
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-")
    const [open, setOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLButtonElement>(null)

    const selectedOption = options.find((opt) => opt.value === value)

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setOpen(false)
        }
      }

      if (open) {
        document.addEventListener("mousedown", handleClickOutside)
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [open])

    const handleSelect = (option: SelectOption) => {
      if (option.disabled) return
      onChange?.(option.value)
      setOpen(false)
    }

    return (
      <div className="w-full" ref={containerRef}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-md text-text-secondary mb-1 block font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative w-full">
          <button
            ref={buttonRef || ref}
            id={inputId}
            type="button"
            onClick={() => setOpen(!open)}
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            className={`flex w-full cursor-pointer items-center justify-between rounded-md border bg-background-secondary px-3 py-2 text-left text-sm shadow-sm transition-colors duration-150 focus:ring-2 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 ${
              leftIcon ? "pl-10" : ""
            } ${
              error
                ? "border-red-300 text-red-900 focus:border-red-500 focus:ring-red-500"
                : "border-border text-foreground hover:border-border-hover focus:border-primary focus:ring-primary"
            } ${className} `}
            {...props}
          >
            {leftIcon && (
              <div className="text-text-muted absolute left-3 flex items-center">
                {leftIcon}
              </div>
            )}
            <span className={selectedOption ? "" : "text-text-muted"}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`text-text-secondary h-4 w-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <ul
              role="listbox"
              className="bg-surface-elevated border-border absolute top-full left-0 z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border py-1 shadow-lg focus:outline-none"
            >
              {options.map((option) => {
                const isSelected = option.value === value
                return (
                  <li
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                    onClick={() => handleSelect(option)}
                    className={`flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors duration-100 ${
                      option.disabled
                        ? "text-text-muted cursor-not-allowed opacity-50"
                        : isSelected
                          ? "bg-primary-muted text-foreground"
                          : "text-foreground hover:bg-surface-hover"
                    } `}
                  >
                    <span>{option.label}</span>
                    {isSelected && <Check className="text-primary h-4 w-4" />}
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-text-muted">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Select.displayName = "Select"

export default Select