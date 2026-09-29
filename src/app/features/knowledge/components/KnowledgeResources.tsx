"use client"

import { ExternalLink, FileText, Plus } from "lucide-react"
import { useQuery } from "@apollo/client/react"

import { GET_RESOURCE_BY_KNOWLEDGE } from "@/graphql/resource/queries"

interface KnowledgeResourcesProps {
  knowledgeId: string
}

const KnowledgeResources = ({ knowledgeId }: KnowledgeResourcesProps) => {
  const { data, loading, error } = useQuery(GET_RESOURCE_BY_KNOWLEDGE, {
    variables: {
      id: knowledgeId,
    },
  })

  const resources = data?.resourcesByKnowledge ?? []

  return (
    <section className="border-border mt-7 rounded-lg border">
      {/* Header */}
      <div className="border-border flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <FileText size={20} className="text-primary" />

          <h2 className="text-xl">Resources</h2>
        </div>

        <button
          type="button"
          className="text-primary flex cursor-pointer items-center gap-1 text-sm hover:underline"
        >
          <Plus size={15} />
          Add Resource
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-surface px-4 py-4">
          <p className="text-text-secondary text-sm">Loading resources...</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-surface px-4 py-4">
          <p className="text-sm text-red-400">Failed to load resources.</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && resources.length === 0 && (
        <div className="bg-surface px-4 py-6 text-center">
          <p className="text-text-secondary text-sm">No resources added yet.</p>

          <p className="text-text-muted mt-1 text-xs">
            Add documentation, articles, videos, and other useful references.
          </p>
        </div>
      )}

      {/* Resource list */}
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

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-primary ml-4 shrink-0 rounded-md p-2 transition-colors"
                aria-label={`Open ${resource.title}`}
              >
                <ExternalLink size={17} />
              </a>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

export default KnowledgeResources
