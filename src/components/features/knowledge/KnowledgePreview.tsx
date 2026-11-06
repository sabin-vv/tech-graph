"use client"

import { useQuery } from "@apollo/client/react"
import {
  Code2,
  Database,
  Eye,
  Lightbulb,
  Network,
  PackageOpen,
} from "lucide-react"
import type { KnowledgeType } from "@/generated/graphql/graphql"
import { GET_CONNECTIONS_BY_KNOWLEDGE } from "@/graphql/connection/queries"
import { GET_RESOURCE_BY_KNOWLEDGE } from "@/graphql/resource/queries"

interface KnowledgePreviewProps {
  knowledgeId?: string
  title: string
  type: KnowledgeType | ""
  tags: string[]
}

const typeStyles: Record<
  KnowledgeType,
  { label: string; accent: string; iconStyle: string; icon: typeof Code2 }
> = {
  technology: {
    label: "Technology",
    accent: "bg-cyan",
    iconStyle: "bg-cyan/10 text-cyan",
    icon: Code2,
  },
  concept: {
    label: "Concept",
    accent: "bg-primary",
    iconStyle: "bg-primary/10 text-primary",
    icon: Lightbulb,
  },
  algorithm: {
    label: "Algorithm",
    accent: "bg-yellow",
    iconStyle: "bg-yellow/10 text-yellow",
    icon: Network,
  },
  database: {
    label: "Database",
    accent: "bg-green",
    iconStyle: "bg-green/10 text-green",
    icon: Database,
  },
}

const KnowledgePreview = ({
  knowledgeId,
  title,
  type,
  tags,
}: KnowledgePreviewProps) => {
  const { data: connectionData, loading: connectionsLoading } = useQuery(
    GET_CONNECTIONS_BY_KNOWLEDGE,
    {
      variables: { id: knowledgeId ?? "" },
      skip: !knowledgeId,
    },
  )
  const { data: resourceData, loading: resourcesLoading } = useQuery(
    GET_RESOURCE_BY_KNOWLEDGE,
    {
      variables: { id: knowledgeId ?? "" },
      skip: !knowledgeId,
    },
  )

  const connections = connectionData?.connectionsByKnowledge ?? []
  const neighbors = connections.slice(0, 4).map((connection) => {
    const isSource = connection.source.id === knowledgeId
    const connected = isSource ? connection.target : connection.source

    return {
      id: connection.id,
      title: connected.title,
      relation: connection.relation.replaceAll("_", " "),
      isSource,
    }
  })
  const style = type ? typeStyles[type] : null
  const TypeIcon = style?.icon
  const visibleTags = tags.slice(0, 3)

  return (
    <aside className="space-y-3">
      <section className="border-border bg-surface overflow-hidden rounded-lg border">
        <div className="border-border text-text-muted flex items-center gap-1.5 border-b px-3 py-2 text-[10px] font-semibold tracking-wider uppercase">
          <Eye size={12} aria-hidden="true" />
          Preview
        </div>

        <div className="flex items-center gap-2.5 px-3 py-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${style?.iconStyle ?? "bg-surface-elevated text-text-muted"}`}
          >
            {TypeIcon ? (
              <TypeIcon size={15} aria-hidden="true" />
            ) : (
              <PackageOpen size={15} aria-hidden="true" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-medium">
              {title.trim() || "Untitled knowledge"}
            </h2>
            <p className="text-text-muted truncate text-[11px]">
              {style?.label ?? "Knowledge"}
              {tags[0] ? ` • ${tags[0]}` : ""}
            </p>
          </div>
        </div>

        <div className="border-border flex min-h-9 flex-wrap gap-1.5 border-t px-3 py-2">
          {visibleTags.length > 0 ? (
            visibleTags.map((tag) => (
              <span
                key={tag}
                className="border-border text-text-secondary rounded border px-1.5 py-0.5 text-[10px]"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="text-text-muted text-[10px]">No tags yet</span>
          )}
          {tags.length > visibleTags.length && (
            <span className="text-text-muted px-1 py-0.5 text-[10px]">
              +{tags.length - visibleTags.length}
            </span>
          )}
        </div>

        <div className="border-border grid grid-cols-2 gap-1.5 border-t p-2">
          <div className="border-border bg-background-secondary rounded border px-2 py-1.5 text-center">
            <p className="text-primary text-sm font-semibold">
              {connectionsLoading ? "—" : connections.length}
            </p>
            <p className="text-text-muted text-[9px] tracking-wide uppercase">
              Connections
            </p>
          </div>
          <div className="border-border bg-background-secondary rounded border px-2 py-1.5 text-center">
            <p className="text-cyan text-sm font-semibold">
              {resourcesLoading
                ? "—"
                : (resourceData?.resourcesByKnowledge.length ?? 0)}
            </p>
            <p className="text-text-muted text-[9px] tracking-wide uppercase">
              Resources
            </p>
          </div>
        </div>
      </section>

      <section className="border-border bg-surface overflow-hidden rounded-lg border">
        <div className="border-border flex items-center justify-between border-b px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <Network size={13} className="text-primary" aria-hidden="true" />
            <h2 className="text-text-secondary text-xs font-medium">
              Map Preview
            </h2>
          </div>
          <span className="text-text-muted text-[10px] uppercase">
            {connectionsLoading ? "Loading" : `${connections.length} links`}
          </span>
        </div>
        <div className="bg-background-secondary relative h-56 overflow-hidden bg-[radial-gradient(var(--border-hover)_0.8px,transparent_0.8px)] bg-size-[16px_16px]">
          {neighbors.length > 0 ? (
            <>
              <div className="bg-primary/10 pointer-events-none absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl" />
              <svg
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 300 224"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                {neighbors.map((neighbor, index) => {
                  const positions = [
                    { x: 150, y: 34 },
                    { x: 36, y: 112 },
                    { x: 150, y: 190 },
                    { x: 264, y: 112 },
                  ]
                  const position = positions[index]
                  if (!position) return null
                  return (
                    <line
                      key={neighbor.id}
                      x1="150"
                      y1="112"
                      x2={position.x}
                      y2={position.y}
                      stroke="var(--border-hover)"
                      strokeDasharray="4 4"
                      strokeWidth="1.25"
                    />
                  )
                })}
                <circle
                  cx="150"
                  cy="112"
                  r="72"
                  fill="none"
                  stroke="var(--primary)"
                  strokeDasharray="2 6"
                  strokeOpacity="0.2"
                />
                <circle
                  cx="150"
                  cy="112"
                  r="93"
                  fill="none"
                  stroke="var(--border-hover)"
                  strokeDasharray="1 8"
                  strokeOpacity="0.55"
                />
              </svg>
              {neighbors.map((neighbor, index) => {
                const positions = [
                  "top-[5%] left-1/2 -translate-x-1/2",
                  "top-1/2 left-[2%] -translate-y-1/2",
                  "bottom-[5%] left-1/2 -translate-x-1/2",
                  "top-1/2 right-[2%] -translate-y-1/2",
                ]
                const position = positions[index]
                if (!position) return null
                return (
                  <div
                    key={neighbor.id}
                    className={`bg-surface border-border absolute flex max-w-[38%] items-center gap-1.5 rounded-lg border px-2 py-1.5 shadow-sm ${position}`}
                    title={neighbor.title}
                  >
                    <span className="bg-primary/15 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[9px] font-semibold">
                      {neighbor.title.charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0">
                      <span className="text-foreground block truncate text-[10px] font-medium">
                        {neighbor.title}
                      </span>
                      <span className="text-text-muted block truncate text-[8px] uppercase">
                        {neighbor.relation}
                      </span>
                    </span>
                  </div>
                )
              })}
              <div className="bg-primary text-background absolute top-1/2 left-1/2 flex max-w-[42%] -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-xl px-3 py-2.5 shadow-[0_0_0_5px_rgba(139,124,255,0.12),0_8px_22px_rgba(0,0,0,0.22)]">
                {TypeIcon ? (
                  <TypeIcon size={14} aria-hidden="true" />
                ) : (
                  <PackageOpen size={14} aria-hidden="true" />
                )}
                <span className="truncate text-[11px] font-semibold">
                  {title.trim() || "Untitled"}
                </span>
              </div>
            </>
          ) : (
            <div className="text-text-muted flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
              <div className="border-border bg-surface flex h-12 w-12 items-center justify-center rounded-xl border border-dashed">
                <Network size={20} aria-hidden="true" />
              </div>
              <div>
                <p className="text-foreground text-xs font-medium">
                  {connectionsLoading
                    ? "Loading connections..."
                    : "No connected knowledge yet"}
                </p>
                <p className="text-text-muted mt-1 text-[10px]">
                  Connections will appear here as your map grows.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </aside>
  )
}

export default KnowledgePreview
