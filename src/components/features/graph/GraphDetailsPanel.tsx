"use client"

import { X, ExternalLink } from "lucide-react"

import type {
  GetConnectionsQuery,
  GetKnowledgeQuery,
} from "@/generated/graphql/graphql"

interface GraphDetailsPanelProps {
  knowledge: GetKnowledgeQuery["knowledge"][number] | null
  connections: GetConnectionsQuery["connections"]
  onClose: () => void
  onViewKnowledge: (id: string) => void
}

const GraphDetailsPanel = ({
  knowledge,
  connections,
  onClose,
  onViewKnowledge,
}: GraphDetailsPanelProps) => {
  if (!knowledge) {
    return null
  }

  const relatedConnections = connections.filter(
    (connection) =>
      connection.source.id === knowledge.id ||
      connection.target.id === knowledge.id,
  )

  return (
    <aside className="bg-surface border-border absolute top-4 right-4 z-20 w-80 rounded-lg border shadow-xl">
      {/* Header */}
      <div className="border-border flex items-start justify-between border-b p-4">
        <div>
          <h2 className="text-lg font-semibold">{knowledge.title}</h2>

          <p className="text-text-secondary mt-1 text-xs uppercase">
            {knowledge.type}
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-text-secondary hover:text-foreground rounded-md p-1"
        >
          <X size={18} />
        </button>
      </div>

      {/* Content */}
      <div className="space-y-5 p-4">
        <div>
          <p className="text-text-secondary mb-2 text-xs uppercase">
            Connections
          </p>

          {relatedConnections.length === 0 ? (
            <p className="text-text-secondary text-sm">No connections.</p>
          ) : (
            <div className="space-y-2">
              {relatedConnections.map((connection) => {
                const isSource = connection.source.id === knowledge.id

                const connectedKnowledge = isSource
                  ? connection.target
                  : connection.source

                return (
                  <div
                    key={connection.id}
                    className="border-border rounded-md border p-3"
                  >
                    <p className="text-sm font-medium">
                      {connectedKnowledge.title}
                    </p>

                    <p className="text-text-secondary mt-1 text-xs uppercase">
                      {connection.relation.replaceAll("_", " ")}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => onViewKnowledge(knowledge.id)}
          className="bg-primary text-background flex w-full items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium"
        >
          View Knowledge
          <ExternalLink size={15} />
        </button>
      </div>
    </aside>
  )
}

export default GraphDetailsPanel
