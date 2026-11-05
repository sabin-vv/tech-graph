"use client"

import { ArrowRight, ExternalLink, X } from "lucide-react"

import type { GetConnectionsQuery } from "@/generated/graphql/graphql"
import Button from "@/components/ui/Button"

export type GraphKnowledge = {
  id: string
  title: string
  description: string
  type: "algorithm" | "concept" | "database" | "technology"
  tags: string[]
}

interface GraphDetailsPanelProps {
  knowledge: GraphKnowledge | null
  connections: GetConnectionsQuery["connections"]
  onClose: () => void
  onViewKnowledge: (id: string) => void
}

const formatType = (type: GraphKnowledge["type"]) =>
  type.charAt(0).toUpperCase() + type.slice(1)

const GraphDetailsPanel = ({
  knowledge,
  connections,
  onClose,
  onViewKnowledge,
}: GraphDetailsPanelProps) => {
  if (!knowledge) {
    return (
      <aside className="bg-surface border-border flex min-h-64 w-full flex-1 items-center justify-center rounded-lg border p-6 text-center">
        <p className="text-text-secondary text-sm">
          Select a node to view its information.
        </p>
      </aside>
    )
  }

  const relatedConnections = connections.filter(
    (connection) =>
      connection.source.id === knowledge.id ||
      connection.target.id === knowledge.id,
  )

  const incomingConnections = relatedConnections.filter(
    (connection) => connection.target.id === knowledge.id,
  )

  const outgoingConnections = relatedConnections.filter(
    (connection) => connection.source.id === knowledge.id,
  )

  const primaryTags =
    knowledge.tags.length > 0 ? knowledge.tags : [formatType(knowledge.type)]

  return (
    <aside className="bg-surface border-border flex w-full flex-col rounded-md border-l shadow-xl">
      <div className="border-border flex items-start justify-between border-b px-4 py-5">
        <div className="min-w-0 space-y-3">
          <div className="text-text-secondary flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
            <span className="bg-primary inline-block h-2 w-2 rounded-full" />
            {formatType(knowledge.type)}
          </div>

          <div>
            <h2 className="text-foreground truncate text-xl font-semibold">
              {knowledge.title}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {primaryTags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="border-primary/30 bg-primary/10 text-primary rounded-md border px-2 py-1 text-[10px] font-medium tracking-[0.08em] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="text-text-secondary hover:text-foreground rounded-md p-1"
          aria-label="Close knowledge information"
        >
          <X size={18} />
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-5 p-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-background-secondary border-border rounded-md border p-3">
            <p className="text-text-secondary text-[10px] font-medium tracking-[0.08em] uppercase">
              Incoming
            </p>
            <p className="text-foreground mt-1 text-lg font-semibold">
              {incomingConnections.length}
            </p>
          </div>

          <div className="bg-background-secondary border-border rounded-md border p-3">
            <p className="text-text-secondary text-[10px] font-medium tracking-[0.08em] uppercase">
              Outgoing
            </p>
            <p className="text-foreground mt-1 text-lg font-semibold">
              {outgoingConnections.length}
            </p>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-foreground text-sm font-semibold">Overview</h3>
          </div>

          <p className="text-text-secondary text-sm leading-6">
            {knowledge.description || "No description available."}
          </p>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-foreground text-sm font-semibold">
              Related Knowledge
            </h3>
            <button
              type="button"
              onClick={() => onViewKnowledge(knowledge.id)}
              className="text-primary text-xs hover:underline"
            >
              View All
            </button>
          </div>

          {relatedConnections.length === 0 ? (
            <div className="border-border bg-background-secondary text-text-secondary rounded-md border p-3 text-sm">
              No related knowledge yet.
            </div>
          ) : (
            <div className="space-y-2">
              {relatedConnections.map((connection) => {
                const isSource = connection.source.id === knowledge.id
                const connectedKnowledge = isSource
                  ? connection.target
                  : connection.source

                return (
                  <button
                    key={connection.id}
                    type="button"
                    onClick={() => onViewKnowledge(connectedKnowledge.id)}
                    className="border-border bg-background-secondary hover:border-primary/50 flex w-full items-center justify-between rounded-md border px-3 py-2.5 text-left transition-colors"
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="border-primary/70 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md border text-xs">
                        ◇
                      </span>

                      <span className="min-w-0">
                        <span className="text-foreground block truncate text-sm font-medium">
                          {connectedKnowledge.title}
                        </span>
                        <span className="text-text-secondary mt-0.5 block text-[10px] tracking-[0.08em] uppercase">
                          {connection.relation.replaceAll("_", " ")}
                        </span>
                      </span>
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-text-secondary shrink-0"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </section>

        <div className="space-y-2 pt-1">
          <Button
            variant="secondary"
            onClick={() => onViewKnowledge(knowledge.id)}
            className="w-full"
          >
            Add Connection
          </Button>
          <Button
            onClick={() => onViewKnowledge(knowledge.id)}
            className="flex w-full items-center justify-center gap-2"
          >
            Open Knowledge
            <ExternalLink size={15} />
          </Button>
        </div>
      </div>
    </aside>
  )
}

export default GraphDetailsPanel
