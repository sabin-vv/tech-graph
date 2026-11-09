import { formatDate } from "@/utils/date"

export type KnowledgeType = "algorithm" | "concept" | "database" | "technology"

export interface KnowledgeItem {
  id: string
  title: string
  type: KnowledgeType
  tags: string[]
  updatedAt: string
}

export interface KnowledgeItemWithConnectionCount extends KnowledgeItem {
  connectionCount: number
  resourceCount: number
}

export type SortField =
  | "title"
  | "type"
  | "tags"
  | "connections"
  | "resources"
  | "updated"
export type SortDirection = "asc" | "desc"

export interface SortState {
  field: SortField
  direction: SortDirection
}

export const TYPE_LABELS: Record<KnowledgeType, string> = {
  algorithm: "Algorithm",
  concept: "Core Concept",
  database: "Database",
  technology: "Technology",
}

export const TYPE_COLORS: Record<KnowledgeType, string> = {
  algorithm: "text-blue-600 bg-blue-100",
  concept: "text-green-600 bg-green-100",
  database: "text-purple-600 bg-purple-100",
  technology: "text-orange-600 bg-orange-100",
}

export function formatRelativeTime(dateString: string): string {
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

  return formatDate(dateString)
}

export function sortKnowledgeItems(
  knowledgeItems: KnowledgeItemWithConnectionCount[],
  sortState: SortState,
): KnowledgeItemWithConnectionCount[] {
  const items = [...knowledgeItems]
  items.sort((a, b) => {
    let aValue: string | number
    let bValue: string | number

    switch (sortState.field) {
      case "title":
        aValue = a.title.toLowerCase()
        bValue = b.title.toLowerCase()
        break
      case "type":
        aValue = TYPE_LABELS[a.type]
        bValue = TYPE_LABELS[b.type]
        break
      case "tags":
        aValue = a.tags.join(", ").toLowerCase()
        bValue = b.tags.join(", ").toLowerCase()
        break
      case "connections":
        aValue = a.connectionCount
        bValue = b.connectionCount
        break
      case "resources":
        aValue = a.resourceCount
        bValue = b.resourceCount
        break
      case "updated":
        aValue = new Date(a.updatedAt).getTime()
        bValue = new Date(b.updatedAt).getTime()
        break
    }

    if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1
    if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1
    return 0
  })

  return items.slice(0, 10)
}
