"use client"

import { useMemo, useState } from "react"
import { gql } from "@apollo/client"
import { useQuery } from "@apollo/client/react"
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Tag,
  GitBranch,
  Clock,
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import SectionHeader from "@/components/layout/SectionHeader"
import Button from "@/components/ui/Button"

const GET_RECENT_KNOWLEDGE = gql`
  query GetRecentKnowledge {
    knowledge {
      id
      title
      type
      tags
      updatedAt
    }
  }
`

const GET_RECENT_CONNECTIONS = gql`
  query GetRecentKnowledgeConnections {
    connections {
      source {
        id
      }
      target {
        id
      }
    }
  }
`

type KnowledgeType = "algorithm" | "concept" | "database" | "technology"

interface KnowledgeItem {
  id: string
  title: string
  type: KnowledgeType
  tags: string[]
  updatedAt: string
}

interface ConnectionItem {
  source: { id: string }
  target: { id: string }
}

interface RecentKnowledgeData {
  knowledge: KnowledgeItem[]
}

interface RecentConnectionsData {
  connections: ConnectionItem[]
}

type SortField = "title" | "type" | "tags" | "connections" | "updated"
type SortDirection = "asc" | "desc"

interface SortState {
  field: SortField
  direction: SortDirection
}

const TYPE_LABELS: Record<KnowledgeType, string> = {
  algorithm: "Algorithm",
  concept: "Core Concept",
  database: "Database",
  technology: "Technology",
}

const TYPE_COLORS: Record<KnowledgeType, string> = {
  algorithm: "text-blue-600 bg-blue-100",
  concept: "text-green-600 bg-green-100",
  database: "text-purple-600 bg-purple-100",
  technology: "text-orange-600 bg-orange-100",
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  })
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
}: {
  label: string
  field: SortField
  currentSort: SortState
  onSort: (field: SortField) => void
}) {
  const isActive = currentSort.field === field
  const direction = isActive ? currentSort.direction : null

  return (
    <th
      scope="col"
      className="px-3 py-2"
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className="text-text-secondary hover:text-foreground flex w-full items-center gap-1 text-left text-xs font-medium tracking-wider uppercase transition-colors"
      >
        {label}
        {isActive && (
          <span aria-hidden="true">
            {direction === "asc" ? (
              <ChevronUp size={10} />
            ) : (
              <ChevronDown size={10} />
            )}
          </span>
        )}
        {!isActive && (
          <ChevronDown size={10} className="text-text-tertiary opacity-50" />
        )}
      </button>
    </th>
  )
}

function KnowledgeTypeBadge({ type }: { type: KnowledgeType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[type]}`}
    >
      {TYPE_LABELS[type]}
    </span>
  )
}

function TagsCell({
  tags,
  maxVisible = 2,
}: {
  tags: string[]
  maxVisible?: number
}) {
  if (!tags.length) {
    return <span className="text-text-tertiary text-sm">—</span>
  }

  const visibleTags = tags.slice(0, maxVisible)
  const remaining = tags.length - maxVisible

  return (
    <div className="flex flex-wrap items-center gap-1">
      {visibleTags.map((tag) => (
        <span
          key={tag}
          className="bg-surface-elevated text-text-secondary border-border inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs"
        >
          <Tag size={9} aria-hidden="true" />
          {tag}
        </span>
      ))}
      {remaining > 0 && (
        <span className="bg-surface-elevated text-text-tertiary border-border inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs">
          +{remaining}
        </span>
      )}
    </div>
  )
}

function ConnectionsCell({ count }: { count: number }) {
  return (
    <div className="text-text-secondary flex items-center justify-center gap-1 text-sm">
      <span className="bg-surface rounded-sm px-2 py-1 font-medium">
        {count}
      </span>
    </div>
  )
}

function UpdatedCell({ date }: { date: string }) {
  return (
    <time
      dateTime={date}
      className="text-text-tertiary text-sm whitespace-nowrap"
      title={formatDate(date)}
    >
      {formatRelativeTime(date)}
    </time>
  )
}

function TableRow({
  item,
  connectionCount,
  updatedAt,
}: {
  item: KnowledgeItem
  connectionCount: number
  updatedAt: string
}) {
  return (
    <tr className="border-border border-opacity-10 hover:bg-surface/50 border-b transition-colors">
      <td className="text-text px-3 py-3 font-medium">
        <span className="block max-w-xs truncate">{item.title}</span>
      </td>
      <td className="px-3 py-3">
        <KnowledgeTypeBadge type={item.type} />
      </td>
      <td className="px-3 py-3">
        <TagsCell tags={item.tags} />
      </td>
      <td className="px-3 py-3 text-center">
        <ConnectionsCell count={connectionCount} />
      </td>
      <td className="px-3 py-3 text-center">
        <UpdatedCell date={updatedAt} />
      </td>
    </tr>
  )
}

function MobileCard({
  item,
  connectionCount,
  updatedAt,
}: {
  item: KnowledgeItem
  connectionCount: number
  updatedAt: string
}) {
  return (
    <article className="border-border bg-surface hover:bg-surface-hover rounded-lg border p-4 transition-colors">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-text truncate font-semibold">{item.title}</h3>
            <KnowledgeTypeBadge type={item.type} />
          </div>
          <div className="mt-2">
            <TagsCell tags={item.tags} maxVisible={3} />
          </div>
        </div>
        <button
          type="button"
          className="text-text-tertiary hover:text-foreground shrink-0 rounded p-1 transition-colors"
          aria-label={`More options for ${item.title}`}
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
      <div className="border-border/20 mt-4 flex flex-wrap items-center justify-between gap-4 border-t pt-4">
        <div className="text-text-secondary flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <GitBranch size={14} aria-hidden="true" />
            <span>
              {connectionCount} connection{connectionCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            <time dateTime={updatedAt} title={formatDate(updatedAt)}>
              {formatRelativeTime(updatedAt)}
            </time>
          </div>
        </div>
      </div>
    </article>
  )
}

function LoadingSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 5 }).map((_, i) => (
        <tr key={i} className="border-border border-opacity-10 border-b">
          <td className="px-3 py-3">
            <div className="bg-surface-elevated h-4 w-3/4 animate-pulse rounded" />
          </td>
          <td className="px-3 py-3">
            <div className="bg-surface-elevated h-5 w-24 animate-pulse rounded-full" />
          </td>
          <td className="px-3 py-3">
            <div className="flex gap-1">
              <div className="bg-surface-elevated h-5 w-16 animate-pulse rounded-full" />
              <div className="bg-surface-elevated h-5 w-16 animate-pulse rounded-full" />
            </div>
          </td>
          <td className="px-3 py-3 text-center">
            <div className="bg-surface-elevated mx-auto h-4 w-8 animate-pulse rounded" />
          </td>
          <td className="px-3 py-3 text-center">
            <div className="bg-surface-elevated mx-auto h-4 w-24 animate-pulse rounded" />
          </td>
        </tr>
      ))}
    </tbody>
  )
}

function EmptyState() {
  return (
    <div className="py-12 text-center">
      <div className="bg-surface-elevated text-text-tertiary mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
        <GitBranch size={24} />
      </div>
      <h3 className="text-foreground text-sm font-medium">
        No knowledge added yet
      </h3>
      <p className="text-text-secondary mt-1 text-xs">
        Start building your knowledge graph by adding your first item.
      </p>
    </div>
  )
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry: () => void
}) {
  return (
    <div className="py-8 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h3 className="text-foreground text-sm font-medium">
        Failed to load knowledge
      </h3>
      <p className="text-text-secondary mt-1 text-xs">{message}</p>
      <Button variant="outline" size="sm" onClick={onRetry} className="mt-4">
        Try Again
      </Button>
    </div>
  )
}

export default function RecentKnowledge() {
  const [sortState, setSortState] = useState<SortState>({
    field: "updated",
    direction: "desc",
  })

  const {
    data: knowledgeData,
    loading: knowledgeLoading,
    error: knowledgeError,
    refetch: refetchKnowledge,
  } = useQuery<RecentKnowledgeData>(GET_RECENT_KNOWLEDGE, {
    fetchPolicy: "cache-and-network",
  })

  const {
    data: connectionData,
    loading: connectionLoading,
    error: connectionError,
    refetch: refetchConnections,
  } = useQuery<RecentConnectionsData>(GET_RECENT_CONNECTIONS, {
    fetchPolicy: "cache-and-network",
  })

  const isLoading = knowledgeLoading || connectionLoading
  const error = knowledgeError || connectionError

  const connectionCountMap = useMemo(() => {
    const map = new Map<string, number>()

    connectionData?.connections?.forEach((conn) => {
      const sourceId = conn.source.id
      const targetId = conn.target.id

      map.set(sourceId, (map.get(sourceId) || 0) + 1)
      map.set(targetId, (map.get(targetId) || 0) + 1)
    })

    return map
  }, [connectionData])

  const knowledgeItems = useMemo(() => {
    if (!knowledgeData?.knowledge) return []

    return knowledgeData.knowledge.map((item) => ({
      ...item,
      connectionCount: connectionCountMap.get(item.id) || 0,
    }))
  }, [knowledgeData, connectionCountMap])

  const sortedItems = useMemo(() => {
    const items = [...knowledgeItems]
    items.sort((a, b) => {
      let aVal: string | number
      let bVal: string | number

      switch (sortState.field) {
        case "title":
          aVal = a.title.toLowerCase()
          bVal = b.title.toLowerCase()
          break
        case "type":
          aVal = TYPE_LABELS[a.type]
          bVal = TYPE_LABELS[b.type]
          break
        case "tags":
          aVal = a.tags.join(", ").toLowerCase()
          bVal = b.tags.join(", ").toLowerCase()
          break
        case "connections":
          aVal = a.connectionCount
          bVal = b.connectionCount
          break
        case "updated":
          aVal = new Date(a.updatedAt).getTime()
          bVal = new Date(b.updatedAt).getTime()
          break
        default:
          return 0
      }

      if (aVal < bVal) return sortState.direction === "asc" ? -1 : 1
      if (aVal > bVal) return sortState.direction === "asc" ? 1 : -1
      return 0
    })

    return items.slice(0, 10)
  }, [knowledgeItems, sortState])

  const handleSort = (field: SortField) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleRetry = () => {
    void Promise.all([refetchKnowledge(), refetchConnections()])
  }

  if (isLoading) {
    return (
      <section
        className="border-border rounded-lg border"
        aria-busy="true"
        aria-label="Loading recent knowledge"
      >
        <SectionHeader
          title="Recently Added Knowledge"
          description="Your most recently updated knowledge items"
        />
        <div className="overflow-x-auto">
          <table className="w-full" role="table">
            <thead>
              <tr className="border-border border-opacity-40 border-b">
                <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                  KNOWLEDGE
                </th>
                <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                  TYPE
                </th>
                <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                  TAGS
                </th>
                <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                  CONNECTIONS
                </th>
                <th className="text-text-secondary px-3 py-2 text-xs font-medium tracking-wider uppercase">
                  UPDATED
                </th>
              </tr>
            </thead>
            <LoadingSkeleton />
          </table>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="border-border rounded-lg border" aria-live="polite">
        <SectionHeader
          title="Recently Added Knowledge"
          description="Your most recently updated knowledge items"
        />
        <ErrorState message={error.message} onRetry={handleRetry} />
      </section>
    )
  }

  if (!sortedItems.length) {
    return (
      <section className="border-border rounded-lg border">
        <SectionHeader
          title="Recently Added Knowledge"
          description="Your most recently updated knowledge items"
        />
        <EmptyState />
      </section>
    )
  }

  return (
    <section
      className="border-border rounded-lg border"
      aria-labelledby="recent-knowledge-heading"
    >
      <SectionHeader
        title="Recently Added Knowledge"
        description="Your most recently updated knowledge items"
        action={
          <Link
            href="/knowledge"
            className="border-border hover:bg-surface inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors"
          >
            View All
            <ChevronRight size={14} aria-hidden="true" />
          </Link>
        }
      />

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full" role="table">
          <caption id="recent-knowledge-heading" className="sr-only">
            Recently added knowledge items
          </caption>
          <thead>
            <tr className="border-border border-opacity-40 border-b">
              <SortableHeader
                label="Knowledge"
                field="title"
                currentSort={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                label="Type"
                field="type"
                currentSort={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                label="Tags"
                field="tags"
                currentSort={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                label="Connections"
                field="connections"
                currentSort={sortState}
                onSort={handleSort}
              />
              <SortableHeader
                label="Updated"
                field="updated"
                currentSort={sortState}
                onSort={handleSort}
              />
            </tr>
          </thead>
          <tbody>
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                connectionCount={item.connectionCount}
                updatedAt={item.updatedAt}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-border divide-y md:hidden">
        {sortedItems.map((item) => (
          <MobileCard
            key={item.id}
            item={item}
            connectionCount={item.connectionCount}
            updatedAt={item.updatedAt}
          />
        ))}
      </div>
    </section>
  )
}
