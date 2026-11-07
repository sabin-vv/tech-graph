"use client"

import { useMemo, useState } from "react"
import { useQuery } from "@apollo/client/react"
import {
  ChevronDown,
  ChevronUp,
  ChevronRight,
  BookOpen,
  Tag,
  GitBranch,
  Clock,
} from "lucide-react"
import Link from "next/link"
import SectionHeader from "@/components/layout/SectionHeader"
import Button from "@/components/ui/Button"
import {
  Table as SharedTable,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow as SharedTableRow,
} from "@/components/ui/Table"
import {
  GET_RECENT_KNOWLEDGE,
  GET_RECENT_KNOWLEDGE_CONNECTIONS,
} from "@/graphql/dashboard/queries"
import { GET_RESOURCES } from "@/graphql/resource/queries"
import {
  formatRelativeTime,
  sortKnowledgeItems,
  TYPE_COLORS,
  TYPE_LABELS,
  type KnowledgeItem,
  type KnowledgeItemWithConnectionCount,
  type KnowledgeType,
  type SortField,
  type SortState,
} from "./recentKnowledgeUtils"
import { formatDate } from "@/utils/date"

function SortableHeader({
  label,
  field,
  currentSort,
  onSort,
  className = "",
  align = "left",
}: {
  label: string
  field: SortField
  currentSort: SortState
  onSort: (field: SortField) => void
  className?: string
  align?: "left" | "center"
}) {
  const isActive = currentSort.field === field
  const direction = isActive ? currentSort.direction : null

  return (
    <TableHead
      scope="col"
      className={`px-3 py-2 ${className}`}
      aria-sort={
        isActive ? (direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`text-text-secondary hover:text-foreground flex w-full items-center gap-1 text-xs font-semibold tracking-normal transition-colors ${
          align === "center" ? "justify-center text-center" : "text-left"
        }`}
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
    </TableHead>
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
      title={formatDate(date, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })}
    >
      {formatRelativeTime(date)}
    </time>
  )
}

function TableRow({
  item,
  connectionCount,
  resourceCount,
  updatedAt,
}: {
  item: KnowledgeItem
  connectionCount: number
  resourceCount: number
  updatedAt: string
}) {
  return (
    <SharedTableRow className="group">
      <TableCell className="text-text font-medium">
        <Link
          href={`/knowledge/${item.id}`}
          className="group-hover:text-primary block max-w-xs truncate transition-colors"
        >
          {item.title}
        </Link>
      </TableCell>
      <TableCell>
        <KnowledgeTypeBadge type={item.type} />
      </TableCell>
      <TableCell>
        <TagsCell tags={item.tags} />
      </TableCell>
      <TableCell className="text-center">
        <ConnectionsCell count={connectionCount} />
      </TableCell>
      <TableCell className="text-center">
        <ConnectionsCell count={resourceCount} />
      </TableCell>
      <TableCell className="text-center">
        <UpdatedCell date={updatedAt} />
      </TableCell>
    </SharedTableRow>
  )
}

function MobileCard({
  item,
  connectionCount,
  resourceCount,
  updatedAt,
}: {
  item: KnowledgeItem
  connectionCount: number
  resourceCount: number
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
            <BookOpen size={14} aria-hidden="true" />
            <span>
              {resourceCount} resource{resourceCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={14} aria-hidden="true" />
            <time
              dateTime={updatedAt}
              title={formatDate(updatedAt, {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            >
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
    <TableBody>
      {Array.from({ length: 5 }).map((_, i) => (
        <SharedTableRow key={i}>
          <TableCell>
            <div className="bg-surface-elevated h-4 w-3/4 animate-pulse rounded" />
          </TableCell>
          <TableCell>
            <div className="bg-surface-elevated h-5 w-24 animate-pulse rounded-full" />
          </TableCell>
          <TableCell>
            <div className="flex gap-1">
              <div className="bg-surface-elevated h-5 w-16 animate-pulse rounded-full" />
              <div className="bg-surface-elevated h-5 w-16 animate-pulse rounded-full" />
            </div>
          </TableCell>
          <TableCell className="text-center">
            <div className="bg-surface-elevated mx-auto h-4 w-8 animate-pulse rounded" />
          </TableCell>
          <TableCell className="text-center">
            <div className="bg-surface-elevated mx-auto h-4 w-8 animate-pulse rounded" />
          </TableCell>
          <TableCell className="text-center">
            <div className="bg-surface-elevated mx-auto h-4 w-24 animate-pulse rounded" />
          </TableCell>
        </SharedTableRow>
      ))}
    </TableBody>
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
  } = useQuery(GET_RECENT_KNOWLEDGE, {
    fetchPolicy: "cache-and-network",
  })

  const {
    data: connectionData,
    loading: connectionLoading,
    error: connectionError,
    refetch: refetchConnections,
  } = useQuery(GET_RECENT_KNOWLEDGE_CONNECTIONS, {
    fetchPolicy: "cache-and-network",
  })

  const {
    data: resourceData,
    loading: resourceLoading,
    error: resourceError,
    refetch: refetchResources,
  } = useQuery(GET_RESOURCES, {
    fetchPolicy: "cache-and-network",
  })

  const isLoading = knowledgeLoading || connectionLoading || resourceLoading
  const error = knowledgeError || connectionError || resourceError

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

  const resourceCountMap = useMemo(() => {
    const map = new Map<string, number>()

    resourceData?.resources?.forEach((resource) => {
      map.set(resource.knowledgeId, (map.get(resource.knowledgeId) ?? 0) + 1)
    })

    return map
  }, [resourceData])

  const knowledgeItems = useMemo<KnowledgeItemWithConnectionCount[]>(() => {
    if (!knowledgeData?.knowledge) return []

    return knowledgeData.knowledge.map((item) => ({
      ...item,
      connectionCount: connectionCountMap.get(item.id) || 0,
      resourceCount: resourceCountMap.get(item.id) || 0,
    }))
  }, [knowledgeData, connectionCountMap, resourceCountMap])

  const sortedItems = useMemo(
    () => sortKnowledgeItems(knowledgeItems, sortState),
    [knowledgeItems, sortState],
  )

  const handleSort = (field: SortField) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }))
  }

  const handleRetry = () => {
    void Promise.all([
      refetchKnowledge(),
      refetchConnections(),
      refetchResources(),
    ])
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
          <SharedTable role="table" className="min-w-205 table-fixed">
            <TableHeader className="bg-background-secondary/40">
              <SharedTableRow>
                <TableHead className="w-1/6">Knowledge</TableHead>
                <TableHead className="w-1/6">Type</TableHead>
                <TableHead className="w-1/6">Tags</TableHead>
                <TableHead className="w-1/6 text-center">Connections</TableHead>
                <TableHead className="w-1/6 text-center">Resources</TableHead>
                <TableHead className="w-1/6 text-center">Updated</TableHead>
              </SharedTableRow>
            </TableHeader>
            <LoadingSkeleton />
          </SharedTable>
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
        <SharedTable role="table" className="min-w-205 table-fixed">
          <TableCaption id="recent-knowledge-heading" className="sr-only">
            Recently added knowledge items
          </TableCaption>
          <TableHeader className="bg-background-secondary/40">
            <SharedTableRow>
              <SortableHeader
                label="Knowledge"
                field="title"
                currentSort={sortState}
                onSort={handleSort}
                className="w-1/6"
              />
              <SortableHeader
                label="Type"
                field="type"
                currentSort={sortState}
                onSort={handleSort}
                className="w-1/6"
              />
              <SortableHeader
                label="Tags"
                field="tags"
                currentSort={sortState}
                onSort={handleSort}
                className="w-1/6"
              />
              <SortableHeader
                label="Connections"
                field="connections"
                currentSort={sortState}
                onSort={handleSort}
                className="w-1/6 text-center"
                align="center"
              />
              <SortableHeader
                label="Resources"
                field="resources"
                currentSort={sortState}
                onSort={handleSort}
                className="w-1/6 text-center"
                align="center"
              />
              <SortableHeader
                label="Updated"
                field="updated"
                currentSort={sortState}
                onSort={handleSort}
                className="w-1/6 text-center"
                align="center"
              />
            </SharedTableRow>
          </TableHeader>
          <TableBody>
            {sortedItems.map((item) => (
              <TableRow
                key={item.id}
                item={item}
                connectionCount={item.connectionCount}
                resourceCount={item.resourceCount}
                updatedAt={item.updatedAt}
              />
            ))}
          </TableBody>
        </SharedTable>
      </div>

      <div className="divide-border divide-y md:hidden">
        {sortedItems.map((item) => (
          <MobileCard
            key={item.id}
            item={item}
            connectionCount={item.connectionCount}
            resourceCount={item.resourceCount}
            updatedAt={item.updatedAt}
          />
        ))}
      </div>
    </section>
  )
}
