"use client"

import { ArrowDownWideNarrow } from "lucide-react"
import Input from "@/components/ui/Input"
import Select, { type SelectOption } from "@/components/ui/Select"

export type KnowledgeSort = "updated" | "title-asc" | "title-desc"

interface KnowledgeSearchProps {
  search: string
  onSearchChange: (value: string) => void
  sort: KnowledgeSort
  onSortChange: (value: KnowledgeSort) => void
}

const sortOptions: SelectOption[] = [
  { label: "Recently updated", value: "updated" },
  { label: "Title: A to Z", value: "title-asc" },
  { label: "Title: Z to A", value: "title-desc" },
]

const KnowledgeSearch = ({
  search,
  onSearchChange,
  sort,
  onSortChange,
}: KnowledgeSearchProps) => {
  return (
    <div className="flex flex-col items-end gap-3 sm:flex-row">
      <div className="w-full flex-1">
        <Input
          label="Search knowledge"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search technologies, concepts..."
          className="bg-background-secondary text-foreground placeholder:text-text-muted"
        />
      </div>
      <div className="w-full sm:w-56">
        <Select
          label="Sort by"
          options={sortOptions}
          value={sort}
          onChange={(value) => onSortChange(value as KnowledgeSort)}
          leftIcon={<ArrowDownWideNarrow size={16} aria-hidden="true" />}
        />
      </div>
    </div>
  )
}
export default KnowledgeSearch
