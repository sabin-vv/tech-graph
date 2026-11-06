"use client"

import Select, { type SelectOption } from "@/components/ui/Select"
import type { KnowledgeType } from "@/generated/graphql/graphql"

export type KnowledgeTypeFilter = "all" | KnowledgeType

interface KnowledgeFiltersProps {
  type: KnowledgeTypeFilter
  tag: string
  tags: string[]
  onTypeChange: (type: KnowledgeTypeFilter) => void
  onTagChange: (tag: string) => void
}

const typeOptions: SelectOption[] = [
  { label: "All types", value: "all" },
  { label: "Technology", value: "technology" },
  { label: "Concept", value: "concept" },
  { label: "Algorithm", value: "algorithm" },
  { label: "Database", value: "database" },
]

const KnowledgeFilters = ({
  type,
  tag,
  tags,
  onTypeChange,
  onTagChange,
}: KnowledgeFiltersProps) => {
  const tagOptions: SelectOption[] = [
    { label: "All tags", value: "" },
    ...tags.map((value) => ({ label: value, value })),
  ]

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <div className="w-full sm:w-48">
        <Select
          label="Type"
          options={typeOptions}
          value={type}
          onChange={(value) => onTypeChange(value as KnowledgeTypeFilter)}
        />
      </div>
      <div className="w-full sm:w-56">
        <Select
          label="Tag"
          options={tagOptions}
          value={tag}
          onChange={onTagChange}
        />
      </div>
    </div>
  )
}

export default KnowledgeFilters
