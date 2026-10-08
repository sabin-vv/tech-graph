"use client"

import {
  forwardRef,
  useCallback,
  useId,
  useState,
  InputHTMLAttributes,
} from "react"
import { Eye, EyeOff } from "lucide-react"

interface PasswordProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  label?: string
  error?: string
  helperText?: string
}

const Password = forwardRef<HTMLInputElement, PasswordProps>(
  (
    { label, error, helperText, className = "", id, disabled, ...props },
    forwardedRef,
  ) => {
    const { ref: fieldRef, ...inputProps } = props as {
      ref?: React.Ref<HTMLInputElement>
    }
    const generatedId = useId()
    const inputId =
      id || label?.toLowerCase().replace(/\s+/g, "-") || generatedId
    const [visible, setVisible] = useState(false)

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        if (typeof fieldRef === "function") fieldRef(node)
        else if (fieldRef) fieldRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) forwardedRef.current = node
      },
      [fieldRef, forwardedRef],
    )

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-text-secondary mb-1 block text-sm font-medium"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={setInputRef}
            id={inputId}
            type={visible ? "text" : "password"}
            disabled={disabled}
            className={`disabled:bg-background-secondary disabled:text-text-muted h-10 w-full rounded-md border px-3 py-2 pr-10 shadow-sm focus:ring-2 focus:ring-offset-0 focus:outline-none disabled:cursor-not-allowed ${
              error
                ? "border-red-500 text-red-400 placeholder-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-border focus:border-primary focus:ring-primary"
            } ${className} `}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={
              error
                ? `${inputId}-error`
                : helperText
                  ? `${inputId}-helper`
                  : undefined
            }
            {...inputProps}
          />
          <button
            type="button"
            onClick={() => setVisible((prev) => !prev)}
            disabled={disabled}
            aria-label="Show password"
            aria-pressed={visible}
            className="text-text-muted hover:text-text-secondary absolute top-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center transition-colors disabled:cursor-not-allowed"
          >
            {visible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="mt-1 text-sm text-red-400"
            role="alert"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="text-text-muted mt-1 text-sm">
            {helperText}
          </p>
        )}
      </div>
    )
  },
)

Password.displayName = "Password"

export default Password
