import { forwardRef, InputHTMLAttributes } from "react"

interface TogglerProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "checked" | "onChange"
  > {
  checked: boolean
  onChange: NonNullable<InputHTMLAttributes<HTMLInputElement>["onChange"]>
}

const Toggler = forwardRef<HTMLInputElement, TogglerProps>(
  ({ checked, onChange, className = "", ...props }, ref) => (
    <span className="relative inline-flex shrink-0 items-center">
      <input
        {...props}
        ref={ref}
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={onChange}
        className={`peer sr-only ${className}`}
      />
      <span
        aria-hidden="true"
        className="bg-surface-elevated peer-checked:bg-primary peer-focus-visible:outline-primary relative block h-6 w-11 rounded-full transition-colors after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-5 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
      />
    </span>
  ),
)

Toggler.displayName = "Toggler"

export default Toggler
