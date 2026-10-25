"use client"

import { RotateCcw, Search, Maximize } from "lucide-react"

interface GraphToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  onFitView: () => void
  onReset: () => void
}

const GraphToolbar = ({
  search,
  onSearchChange,
  onFitView,
  onReset,
}: GraphToolbarProps) => {
  return (
    <div className="border-border bg-surface mb-4 flex items-center justify-between rounded-lg border p-3">
      <div>
        <h1 className="text-xl font-semibold">Knowledge Graph</h1>

        <p className="text-text-secondary mt-1 text-xs">
          Explore relationships between your knowledge.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="border-border bg-background-secondary flex items-center rounded-md border px-3">
          <Search size={16} className="text-text-secondary" />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search knowledge..."
            className="bg-transparent px-2 py-2 text-sm outline-none"
          />
        </div>

        {/* Fit View */}
        <button
          type="button"
          onClick={onFitView}
          className="border-border text-text-secondary hover:text-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
        >
          <Maximize size={15} />
          Fit
        </button>

        {/* Reset */}
        <button
          type="button"
          onClick={onReset}
          className="border-border text-text-secondary hover:text-foreground flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors"
        >
          <RotateCcw size={15} />
          Reset
        </button>
      </div>
    </div>
  )
}

export default GraphToolbar
