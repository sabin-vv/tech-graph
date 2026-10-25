"use client"

import { ExternalLink, FileText, Pencil, Plus, Trash2 } from "lucide-react"
import { useMutation, useQuery } from "@apollo/client/react"

import { GET_RESOURCE_BY_KNOWLEDGE } from "@/graphql/resource/queries"
import Button from "@/components/ui/Button"
import { useState } from "react"
import ResourceDrawer from "./ResourceDrawer"
import { DELETE_RESOURCE } from "@/graphql/resource/mutations"

interface KnowledgeResourcesProps {
  knowledgeId: string
}

type ResourceType =
  "article" | "video" | "documentation" | "course" | "github" | "other"
export interface EditResource {
  id: string
  title: string
  url: string
  type: ResourceType
  description: string
}

const KnowledgeResources = ({ knowledgeId }: KnowledgeResourcesProps) => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)
  const [editResource, setEditResource] = useState<EditResource | null>(null)
  const { data, loading, error, refetch } = useQuery(
    GET_RESOURCE_BY_KNOWLEDGE,
    {
      variables: {
        id: knowledgeId,
      },
    },
  )

  const [deleteResorce, { loading: deleting }] = useMutation(DELETE_RESOURCE)

  const resources = data?.resourcesByKnowledge ?? []

  const handleEditResource = (data: EditResource) => {
    setEditResource(data)
    setDrawerOpen(true)
  }

  const handleAddResource = () => {
    setEditResource(null)
    setDrawerOpen(true)
  }
  const handleDeleteResource = async (id: string) => {
    const confirmed = window.confirm("Are you sure want to delete connection?")
    if (!confirmed) return

    try {
      await deleteResorce({ variables: { id } })
      await refetch()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <section className="border-border mt-7 rounded-lg border">
      <div className="border-border flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />

          <h2 className="text-xl">Resources</h2>
        </div>

        <Button variant="secondary" onClick={handleAddResource}>
          <Plus size={15} />
          Add Resource
        </Button>
      </div>

      {loading && (
        <div className="bg-surface px-4 py-4">
          <p className="text-text-secondary text-sm">Loading resources...</p>
        </div>
      )}

      {error && (
        <div className="bg-surface px-4 py-4">
          <p className="text-sm text-red-400">Failed to load resources.</p>
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <div className="bg-surface px-4 py-6 text-center">
          <p className="text-text-secondary text-sm">No resources added yet.</p>

          <p className="text-text-muted mt-1 text-xs">
            Add documentation, articles, videos, and other useful references.
          </p>
        </div>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="bg-surface px-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="border-border flex items-center justify-between border-b py-4 last:border-b-0"
            >
              <div className="min-w-0">
                <h3 className="truncate text-base font-medium">
                  {resource.title}
                </h3>

                {resource.description && (
                  <p className="text-text-secondary mt-1 line-clamp-2 text-sm">
                    {resource.description}
                  </p>
                )}

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-text-secondary border-border rounded-md border px-2 py-1 text-[10px] uppercase">
                    {resource.type.replaceAll("_", " ")}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-primary ml-4 shrink-0 rounded-md p-2 transition-colors"
                  aria-label={`Open ${resource.title}`}
                >
                  <ExternalLink size={17} />
                </a>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    handleEditResource({
                      id: resource.id,
                      title: resource.title,
                      type: resource.type,
                      url: resource.url,
                      description: resource.description,
                    })
                  }
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleting}
                  onClick={() => handleDeleteResource(resource.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
      <ResourceDrawer
        knowledgeId={knowledgeId}
        onClose={() => setDrawerOpen(false)}
        onSuccess={() => refetch()}
        open={drawerOpen}
        editingResource={editResource}
      />
    </section>
  )
}

export default KnowledgeResources
