import { CalendarDays, Info, RotateCcwClock } from "lucide-react"

const KnowledgeDescription = () => {
  return (
    <div className="border-border mt-7 rounded-lg border">
      <h1 className="flex items-center gap-2 p-4 text-xl">
        <Info size={20} color="#2698ff" />
        About
      </h1>
      <div className="bg-surface">
        <p className="text-text-secondary border-border border-b p-4 text-justify text-lg leading-loose">
          Node.js is an open-source, cross-platform JavaScript runtime
          environment that executes JavaScript code outside a web browser. Built
          on Chrome&apos;s V8 JavaScript engine, it enables developers to use
          JavaScript to write command line tools and for server-side scripting.
          Its asynchronous, event-driven architecture makes it particularly
          suited for data-intensive real-time applications that run across
          distributed devices, operating on a single-thread event loop model
          rather than creating a new thread for every request.
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
