"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client/react"
import { CREATE_CONNECTION } from "@/graphql/connection/mutations"
import type { Relation } from "@/generated/graphql/graphql"
import { GET_KNOWLEDGE_FOR_CONNECTION } from "@/graphql/knowledge/queries"
import Select, { SelectOption } from "@/components/ui/Select"

interface ConnectionDrawerProps {
  knowledgeId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

const relationOptions = [
  { label: "Uses", value: "uses" },
  { label: "Related To", value: "related_to" },
  { label: "Part Of", value: "part_of" },
  { label: "Depends On", value: "depends_on" },
  { label: "Built With", value: "built_with" },
  { label: "Extends", value: "extends" },
]

type RelationState = Relation | ""

const ConnectionDrawer = ({
  knowledgeId,
  open,
  onClose,
  onSuccess,
}: ConnectionDrawerProps) => {
  const [targetId, setTargetId] = useState("")
  const [relation, setRelation] = useState<RelationState>("")
  const [formError, setFormError] = useState<string | null>(null)
  const handleRelationChange = (value: string) => {
    setRelation(value as RelationState)
  }

  const { data, loading: knowledgeLoading } = useQuery(
    GET_KNOWLEDGE_FOR_CONNECTION,
    {
      skip: !open,
    },
  )

  const [createConnection, { loading: creating }] =
    useMutation(CREATE_CONNECTION)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!targetId) {
      setFormError("Please select a knowledge")
      return
    }

    if (!relation) {
      setFormError("Please select a relation")
      return
    }

    try {
      await createConnection({
        variables: {
          input: {
            userId: "default-user",
            sourceId: knowledgeId,
            targetId,
            relation,
          },
        },
      })

      setTargetId("")
      setRelation("")

      onSuccess()
      onClose()
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create connection",
      )
    }
  }

  const availableKnowledge =
    data?.knowledge.filter((knowledge) => knowledge.id !== knowledgeId) ?? []
  const knowledgeOptions: SelectOption[] = availableKnowledge.map((o) => ({
    label: o.title,
    value: o.id,
  }))

  if (!open) {
    return null
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <aside className="bg-surface border-border fixed top-0 right-0 z-50 h-full w-full max-w-md border-l shadow-xl">
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b p-5">
            <div>
              <h2 className="text-xl font-semibold">Add Connection</h2>

              <p className="text-text-secondary mt-1 text-sm">
                Connect this knowledge to another node.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-text-secondary hover:text-foreground rounded-md p-2 transition-colors"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            <div className="flex-1 space-y-5 p-5">
              <Select
                label="Knowledge"
                options={knowledgeOptions}
                placeholder={
                  knowledgeLoading ? "Loading knowledge..." : "Select knowledge"
                }
                value={targetId}
                onChange={setTargetId}
                disabled={knowledgeLoading}
              />
              <Select
                label="Relation"
                options={relationOptions}
                value={relation}
                onChange={handleRelationChange}
              />

              {targetId && relation && (
                <div className="border-border bg-background-secondary rounded-lg border p-4">
                  <p className="text-text-secondary mb-2 text-xs uppercase">
                    Connection preview
                  </p>

                  <p className="text-sm">
                    This knowledge
                    <span className="text-primary mx-2">→</span>
                    {
                      relationOptions.find((item) => item.value === relation)
                        ?.label
                    }
                    <span className="text-primary mx-2">→</span>
                    {
                      availableKnowledge.find(
                        (knowledge) => knowledge.id === targetId,
                      )?.title
                    }
                  </p>
                </div>
              )}

              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {formError}
                </div>
              )}
            </div>

            <div className="border-border flex justify-end gap-3 border-t p-5">
              <button
                type="button"
                onClick={onClose}
                disabled={creating}
                className="border-border rounded-md border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={creating}
                className="bg-primary text-background rounded-md px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                {creating ? "Adding..." : "Add Connection"}
              </button>
            </div>
          </form>
        </div>
      </aside>
    </>
  )
}

export default ConnectionDrawer
