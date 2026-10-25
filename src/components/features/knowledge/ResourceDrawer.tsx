"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { useMutation } from "@apollo/client/react"

import Input from "@/components/ui/Input"
import Select, { SelectOption } from "@/components/ui/Select"
import Textarea from "@/components/ui/Textarea"
import Button from "@/components/ui/Button"

import { CREATE_RESOURCE, UPDATE_RESOURCE } from "@/graphql/resource/mutations"

import type { ResourceType } from "@/generated/graphql/graphql"
import { EditResource } from "./KnowledgeResources"

interface ResourceDrawerProps {
  knowledgeId: string
  open: boolean
  onClose: () => void
  onSuccess: () => void
  editingResource?: EditResource | null
}

type ResourceTypeState = ResourceType | ""

const resourceTypeOptions: SelectOption[] = [
  {
    label: "Article",
    value: "article",
  },
  {
    label: "Video",
    value: "video",
  },
  {
    label: "Documentation",
    value: "documentation",
  },
  {
    label: "Course",
    value: "course",
  },
  {
    label: "GitHub",
    value: "github",
  },
  {
    label: "Other",
    value: "other",
  },
]

const ResourceDrawerPanel = ({
  knowledgeId,
  onClose,
  onSuccess,
  editingResource,
}: Omit<ResourceDrawerProps, "open">) => {
  const isEditing = Boolean(editingResource)

  const [title, setTitle] = useState(editingResource?.title ?? "")
  const [url, setUrl] = useState(editingResource?.url ?? "")
  const [type, setType] = useState<ResourceTypeState>(
    editingResource?.type ?? "",
  )
  const [description, setDescription] = useState(
    editingResource?.description ?? "",
  )
  const [formError, setFormError] = useState<string | null>(null)

  const [createResource, { loading: creating }] = useMutation(CREATE_RESOURCE)
  const [updateResource, { loading: updating }] = useMutation(UPDATE_RESOURCE)

  const loading = creating || updating

  const handleTypeChange = (value: string) => {
    setType(value as ResourceTypeState)
  }

  const handleClose = () => {
    if (loading) {
      return
    }

    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const trimmedTitle = title.trim()
    const trimmedUrl = url.trim()
    const trimmedDescription = description.trim()

    if (!trimmedTitle) {
      setFormError("Please enter a resource title")
      return
    }

    if (!trimmedUrl) {
      setFormError("Please enter a resource URL")
      return
    }

    if (!type) {
      setFormError("Please select a resource type")
      return
    }

    if (!trimmedDescription) {
      setFormError("Please enter a resource description")
      return
    }

    try {
      new URL(trimmedUrl)
    } catch {
      setFormError("Please enter a valid URL")
      return
    }

    if (isEditing && editingResource) {
      try {
        await updateResource({
          variables: {
            id: editingResource.id,
            input: {
              title: trimmedTitle,
              url: trimmedUrl,
              type,
              description: trimmedDescription,
            },
          },
        })

        onSuccess()
        handleClose()
      } catch (error) {
        setFormError(
          error instanceof Error ? error.message : "Failed to update resource",
        )
      }

      return
    }

    try {
      await createResource({
        variables: {
          input: {
            knowledgeId,
            title: trimmedTitle,
            url: trimmedUrl,
            type,
            description: trimmedDescription,
          },
        },
      })

      onSuccess()
      handleClose()
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : "Failed to create resource",
      )
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={handleClose} />

      <aside className="bg-surface border-border fixed top-0 right-0 z-50 h-full w-full max-w-md border-l shadow-xl">
        <div className="flex h-full flex-col">
          <div className="border-border flex items-center justify-between border-b p-5">
            <div>
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Resource" : "Add Resource"}
              </h2>

              <p className="text-text-secondary mt-1 text-sm">
                {isEditing
                  ? "Update this reference for your knowledge."
                  : "Add a useful reference for this knowledge."}
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="text-text-secondary hover:text-foreground rounded-md p-2 transition-colors disabled:opacity-50"
              aria-label="Close drawer"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              <Input
                label="Title"
                placeholder="e.g., Node.js Documentation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={loading}
              />

              <Input
                label="URL"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
              />

              <Select
                label="Type"
                options={resourceTypeOptions}
                placeholder="Select resource type"
                value={type}
                onChange={handleTypeChange}
                disabled={loading}
              />

              <Textarea
                label="Description"
                placeholder="Briefly describe this resource..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
              />

              {formError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
                  {formError}
                </div>
              )}
            </div>

            <div className="border-border flex justify-end gap-3 border-t p-5">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>

              <Button type="submit" loading={loading} disabled={loading}>
                {loading
                  ? isEditing
                    ? "Updating"
                    : "Adding..."
                  : isEditing
                    ? "Update Resource"
                    : "Add Resource"}
              </Button>
            </div>
          </form>
        </div>
      </aside>
    </>
  )
}

const ResourceDrawer = ({ open, ...props }: ResourceDrawerProps) => {
  if (!open) {
    return null
  }

  return <ResourceDrawerPanel {...props} />
}

export default ResourceDrawer
