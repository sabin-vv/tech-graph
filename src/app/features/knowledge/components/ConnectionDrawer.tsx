"use client"

import { useEffect, useState, useRef } from "react"
import { X } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client/react"
import {
  CREATE_CONNECTION,
  UPDATE_CONNECTION,
} from "@/graphql/connection/mutations"
import type { Relation } from "@/generated/graphql/graphql"
import { GET_KNOWLEDGE_FOR_CONNECTION } from "@/graphql/knowledge/queries"
import Select, { SelectOption } from "@/components/ui/Select"
import Button from "@/components/ui/Button"

interface EditingConnection {
  id: string
  relation: Relation
  connectedTitle: string
}
interface ConnectionDrawerProps {
  source: string
  knowledgeId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
  editingConnection?: EditingConnection | null
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
  source,
  knowledgeId,
  open,
  onClose,
  onSuccess,
  editingConnection,
}: ConnectionDrawerProps) => {
  const isEditing = Boolean(editingConnection)
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
  const [updateConnection, { loading: updating }] =
    useMutation(UPDATE_CONNECTION)

  const loading = creating || updating

  const justOpened = useRef(open)

  useEffect(() => {
    if (!open) {
      justOpened.current = false
      return
    }

    if (!justOpened.current) return
    justOpened.current = false
    setFormError(null)
  }, [open, editingConnection])

  useEffect(() => {
    justOpened.current = true
  }, [open])

  const handleClose = () => {
    if (loading) return
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (isEditing) {
      if (!relation) {
        setFormError("Please select a relation")
        return
      }

      try {
        await updateConnection({
          variables: {
            id: editingConnection!.id,
            input: {
              relation,
            },
          },
        })

        onSuccess()
        handleClose()
      } catch (error) {
        setFormError(
          error instanceof Error
            ? error.message
            : "Failed to update connection",
        )
      }

      return
    }

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
                    {source}
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
              <Button variant="secondary" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit">
                {loading
                  ? isEditing
                    ? "Updating"
                    : "Adding..."
                  : isEditing
                    ? "Update Connection"
                    : "Add Connection"}
              </Button>
            </div>
          </form>
        </div>
      </aside>
    </>
  )
}

export default ConnectionDrawer
