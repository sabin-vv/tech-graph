"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import KnowledgeCardGrid from "@/components/features/knowledge/KnowledgeCardGrid"
import KnowledgeSearch from "@/components/features/knowledge/KnowledgeSearch"
import KnowledgeFilters from "@/components/features/knowledge/KnowledgeFilters"
import PageHeader from "@/components/layout/PageHeader"
import { useQuery } from "@apollo/client/react"
import { GET_KNOWLEDGE_FOR_EXPLORE } from "@/graphql/knowledge/queries"
import { useMemo, useState } from "react"
import type { KnowledgeSort } from "@/components/features/knowledge/KnowledgeSearch"
import type { KnowledgeTypeFilter } from "@/components/features/knowledge/KnowledgeFilters"
import { X } from "lucide-react"

const ExplorePage = () => {
  const [search, setSearch] = useState("")
  const [type, setType] = useState<KnowledgeTypeFilter>("all")
  const [tag, setTag] = useState("")
  const [sort, setSort] = useState<KnowledgeSort>("updated")
  const { data, loading, error, refetch } = useQuery(GET_KNOWLEDGE_FOR_EXPLORE)
  const knowledge = data?.knowledge ?? []
  const tags = [...new Set(knowledge.flatMap((item) => item.tags))].sort(
    (a, b) => a.localeCompare(b),
  )
  const hasActiveFilters = Boolean(search.trim() || type !== "all" || tag)

  const clearFilters = () => {
    setSearch("")
    setType("all")
    setTag("")
  }

  const filteredKnowledge = useMemo(() => {
    const searchTerm = search.trim().toLocaleLowerCase()
    const filtered = (data?.knowledge ?? []).filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.title.toLocaleLowerCase().includes(searchTerm) ||
        item.description.toLocaleLowerCase().includes(searchTerm) ||
        item.tags.some((itemTag) =>
          itemTag.toLocaleLowerCase().includes(searchTerm),
        )
      const matchesType = type === "all" || item.type === type
      const matchesTag = !tag || item.tags.includes(tag)

      return matchesSearch && matchesType && matchesTag
    })

    return filtered.sort((a, b) => {
      if (sort === "title-asc") {
        return a.title.localeCompare(b.title)
      }
      if (sort === "title-desc") {
        return b.title.localeCompare(a.title)
      }
      return Date.parse(b.updatedAt) - Date.parse(a.updatedAt)
    })
  }, [data?.knowledge, search, sort, tag, type])

  return (
    <DashboardLayout>
      <PageHeader
        title="Explore Knowledge"
        description="Search and discover knowledge in your collection"
      />
      <KnowledgeSearch
        search={search}
        onSearchChange={setSearch}
        sort={sort}
        onSortChange={setSort}
      />
      <KnowledgeFilters
        type={type}
        tag={tag}
        tags={tags}
        onTypeChange={setType}
        onTagChange={setTag}
      />
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-text-secondary text-sm">Active filters:</span>
          {search.trim() && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="border-border bg-surface text-foreground hover:border-border-hover inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
              aria-label={`Remove search filter: ${search.trim()}`}
            >
              Search: “{search.trim()}”
              <X size={13} aria-hidden="true" />
            </button>
          )}
          {type !== "all" && (
            <button
              type="button"
              onClick={() => setType("all")}
              className="border-border bg-surface text-foreground hover:border-border-hover inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
              aria-label={`Remove type filter: ${type}`}
            >
              {type}
              <X size={13} aria-hidden="true" />
            </button>
          )}
          {tag && (
            <button
              type="button"
              onClick={() => setTag("")}
              className="border-border bg-surface text-foreground hover:border-border-hover inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs"
              aria-label={`Remove tag filter: ${tag}`}
            >
              {tag}
              <X size={13} aria-hidden="true" />
            </button>
          )}
          <button
            type="button"
            onClick={clearFilters}
            className="text-primary hover:text-primary-hover px-2 py-1 text-xs font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
      {loading && (
        <p className="text-text-secondary" role="status">
          Loading knowledge...
        </p>
      )}
      {error && (
        <div className="flex items-center gap-3" role="alert">
          <p className="text-red-400">
            Unable to load knowledge: {error.message}
          </p>
          <button
            type="button"
            className="text-primary hover:underline"
            onClick={() => void refetch()}
          >
            Try again
          </button>
        </div>
      )}
      {!loading && !error && knowledge.length === 0 && (
        <p className="text-text-secondary">
          No knowledge found. Add an item to start exploring your collection.
        </p>
      )}
      {!loading &&
        !error &&
        knowledge.length > 0 &&
        filteredKnowledge.length === 0 && (
          <p className="text-text-secondary">
            No results match your search and filters.
          </p>
        )}
      {!loading && !error && filteredKnowledge.length > 0 && (
        <KnowledgeCardGrid knowledge={filteredKnowledge} />
      )}
    </DashboardLayout>
  )
}
export default ExplorePage
