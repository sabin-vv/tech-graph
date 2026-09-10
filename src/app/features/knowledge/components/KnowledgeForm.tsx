"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useMutation } from "@apollo/client/react"
import { gql } from "@apollo/client"
import Input from "@/components/ui/Input"
import Select, { SelectOption } from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import Button from "@/components/ui/Button"
import { X } from "lucide-react"

const CREATE_KNOWLEDGE = gql`
  mutation CreateKnowledge($input: CreateKnowledgeInput!) {
    createKnowledge(input: $input) {
      id
      title
    }
  }
`

interface CreateKnowledgeData {
  createKnowledge: {
    id: string
    title: string
  }
}

const KnowledgeForm = () => {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [type, setType] = useState<string>("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [tagError, setTagError] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const MAX_TAG_LENGTH = 30
  const MAX_TAG_COUNT = 10

  const [createKnowledge] = useMutation<CreateKnowledgeData>(CREATE_KNOWLEDGE)

  const typeOptions: SelectOption[] = [
    { label: "Technology", value: "technology" },
    { label: "Concept", value: "concept" },
    { label: "Algorithm", value: "algorithm" },
    { label: "Database", value: "database" },
  ]

  const handleAddTag = (value: string) => {
    setTagError(null)
    const trimmed = value.trim()

    if (!trimmed) {
      setTagInput("")
      return
    }

    if (trimmed.length > MAX_TAG_LENGTH) {
      setTagError(`Tag must be ${MAX_TAG_LENGTH} characters or less`)
      return
    }

    if (tags.length >= MAX_TAG_COUNT) {
      setTagError(`Maximum ${MAX_TAG_COUNT} tags allowed`)
      return
    }

    if (tags.some((t) => t.toLowerCase() === trimmed.toLowerCase())) {
      setTagError("Tag already exists")
      return
    }

    setTags([...tags, trimmed])
    setTagInput("")
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!title || !type || !description) {
      setError("Please fill in all required fields")
      return
    }

    setLoading(true)
    try {
      const { data } = await createKnowledge({
        variables: {
          input: {
            title,
            description,
            type,
            tags,
            userId: "default-user",
          },
        },
      })

      if (data?.createKnowledge?.id) {
        router.push(`/knowledge/${data.createKnowledge.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-3/4 space-y-5">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="border-border bg-surface rounded-lg border p-4">
        <h1 className="border-border mb-7 border-b-2 py-4 text-2xl">
          Basic Information
        </h1>
        <div className="grid grid-cols-2 gap-5">
          <Input
            className="bg-background-secondary"
            label="Knowledge Name"
            placeholder="e.g., React, Event Sourcing, Kubernetes"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Select
            label="Type"
            options={typeOptions}
            value={type}
            onChange={setType}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="border-border bg-surface rounded-lg border p-4">
          <h1 className="border-border mb-7 border-b-2 py-4 text-2xl">
            Description
          </h1>
          <Textarea
            className="bg-background-secondary"
            placeholder="Briefly describe this knowledge node..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="border-border bg-surface rounded-lg border p-4">
          <h1 className="border-border mb-7 border-b-2 py-4 text-2xl">Tags</h1>

          <div>
            <div>
              <Input
                className="bg-background-secondary"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                disabled={tags.length >= MAX_TAG_COUNT}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddTag(tagInput)
                  }
                }}
              />
              <div className="mt-1 flex items-center justify-between text-sm">
                {tagError ? (
                  <span className="text-red-500">{tagError}</span>
                ) : (
                  <span />
                )}
                <span className="text-text-muted">
                  {tags.length}/{MAX_TAG_COUNT} tags
                </span>
              </div>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap items-baseline gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primary/10 text-primary inline-flex max-h-fit items-center gap-1 rounded-md px-2 py-1 text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-text-secondary hover:text-foreground cursor-pointer rounded p-0.5 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-7 mb-7 flex flex-row-reverse gap-3">
        <Button type="submit" loading={loading} disabled={loading}>
          Create Knowledge
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default KnowledgeForm
