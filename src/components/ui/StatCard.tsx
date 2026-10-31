import type { ReactNode } from "react"

interface StatCardProps {
  label: string
  value: ReactNode
  icon?: ReactNode
  footer?: ReactNode
  className?: string
}

const StatCard = ({
  label,
  value,
  icon,
  footer,
  className = "",
}: StatCardProps) => {
  return (
    <article
      className={`border-border flex flex-col gap-2 rounded-lg border p-4 ${className}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-text-secondary text-xl">{label}</h2>
        {icon && <div className="text-primary shrink-0">{icon}</div>}
      </div>

      <div className="text-4xl font-semibold">{value}</div>

      {footer && <div className="text-text-secondary text-sm">{footer}</div>}
    </article>
  )
}

export default StatCard
