import { CalendarDays, Info, RotateCcwClock } from "lucide-react"

interface KnowledgrDescriptionProps {
  description: string
}

const KnowledgeDescription = ({ description }: KnowledgrDescriptionProps) => {
  return (
    <div className="border-border rounded-lg border">
      <h1 className="flex items-center gap-2 p-4 text-xl">
        <Info size={20} color="#2698ff" />
        About
      </h1>
      <div className="bg-surface">
        <p className="text-text-secondary border-border border-b p-4 text-justify text-lg leading-loose">
          {description}
        </p>
      </div>
      <div className="text-text-muted mt-2 flex gap-6 p-4 text-sm">
        <span className="flex items-center gap-1">
          <CalendarDays size={16} /> 12 Oct 2025
        </span>
        <span className="flex items-center gap-1">
          <RotateCcwClock size={16} /> 2 hours Ago
        </span>
      </div>
    </div>
  )
}
export default KnowledgeDescription
