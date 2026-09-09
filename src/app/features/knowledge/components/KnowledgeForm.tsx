"use client"

import { useState } from "react"
import Input from "@/components/ui/Input"
import Select, { SelectOption } from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import SearchInput from "@/components/ui/SearchInput"
import Button from "@/components/ui/Button"

interface Relation {
  type: string
  target: string
}

const KnowledgeForm = () => {
  const [type, setType] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [relations, setRelations] = useState<Relation[]>([
    { type: "", target: "" },
    { type: "", target: "" },
  ])

  const typeOptions: SelectOption[] = [
    { label: "Technology", value: "technology" },
  ]

  const categoryTypes: SelectOption[] = [
    { label: "Frontend", value: "frontend" },
  ]

  const relationOptions: SelectOption[] = [
    { label: "Uses", value: "uses" },
    { label: "Related to", value: "related_to" },
  ]

  const updateRelation = (
    index: number,
    field: keyof Relation,
    value: string,
  ) => {
    setRelations((prev) =>
      prev.map((rel, i) => (i === index ? { ...rel, [field]: value } : rel)),
    )
  }

  return (
    <form className="w-3/4 space-y-4">
      <div className="border-border bg-surface rounded-lg border p-4">
        <div>
          <h1 className="border-border mb-7 border-b-2 py-4 text-2xl">
            Basic Information
          </h1>
        </div>
        <Input
          label="Knowledge Name"
          placeholder="e.g., React, Event Sourcing, Kubernetes"
        />

        <div className="mt-4 flex gap-3">
          <Select
            label="Type"
            options={typeOptions}
            value={type}
            onChange={setType}
          />
          <Select
            label="Category"
            options={categoryTypes}
            value={category}
            onChange={setCategory}
          />
        </div>
      </div>
      <div className="border-border bg-surface rounded-lg border p-4">
        <h1 className="border-border mb-7 border-b-2 py-4 text-2xl">
          Description
        </h1>
        <Textarea placeholder="Briefly describe this knowledge node..." />
      </div>
      <div className="border-border bg-surface rounded-lg border p-4">
        <h1 className="border-border mb-7 border-b-2 py-4 text-2xl">
          Connections
        </h1>
        <span className="text-text-secondary">Related Knowledge</span>
        <div className="mt-4 space-y-2">
          {relations.map((relation, index) => (
            <div key={index} className="flex gap-2">
              <Select
                value={relation.type}
                onChange={(value) => updateRelation(index, "type", value)}
                options={relationOptions}
                placeholder="Relation"
              />
              <Input
                placeholder="e.g., JavaScript"
                value={relation.target}
                onChange={(e) =>
                  updateRelation(index, "target", e.target.value)
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="border-border bg-surface rounded-lg border p-4">
        <h1 className="border-border mb-7 border-b-2 py-4 text-2xl">Tags</h1>

        <SearchInput placeholder="Add tag..." />
      </div>
      <div className="mt-7 mb-7 flex flex-row-reverse gap-3">
        <Button>Create knowledge</Button>
        <Button variant="outline">Cancel</Button>
      </div>
    </form>
  )
}

export default KnowledgeForm
