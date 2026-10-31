import type { ReactNode } from "react"

interface SectionHeaderProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

const SectionHeader = ({
  title,
  description,
  action,
  className = "",
}: SectionHeaderProps) => {
  return (
    <header
      className={`border-border bg-surface flex items-center justify-between border-b px-5 py-4 ${className}`}
    >
      <div className="min-w-0">
        <h2 className="text-foreground text-sm font-semibold">{title}</h2>
        {description && (
          <p className="text-text-secondary mt-1 text-xs">{description}</p>
        )}
      </div>

      {action && <div className="ml-4 shrink-0">{action}</div>}
    </header>
  )
}

export default SectionHeader
