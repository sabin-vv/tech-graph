"use client"
import KnowledgeConnection from "@/components/features/knowledge/KnowledgeConnection"
import KnowledgeDescription from "@/components/features/knowledge/KnowledgeDescription"
import KnowledgeMetrics from "@/components/features/knowledge/KnowledgeMetrics"
import KnowledgeResources from "@/components/features/knowledge/KnowledgeResources"
import DashboardLayout from "@/components/layout/DashboardLayout"
import PageHeader from "@/components/layout/PageHeader"
import { GET_KNOWLEDGE_BY_ID } from "@/graphql/knowledge/queries"
import { useQuery } from "@apollo/client/react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Pencil } from "lucide-react"

const KnowledgeDetailsPage = () => {
  const { id } = useParams<{ id: string }>()

  const { data, loading, error } = useQuery(GET_KNOWLEDGE_BY_ID, {
    variables: { id },
  })

  const knowledge = data?.knowledgeById

  if (loading) {
    return (
      <DashboardLayout>
        <p>Loading knowledge...</p>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <p role="alert">Unable to load knowledge: {error.message}</p>
      </DashboardLayout>
    )
  }

  if (!knowledge) {
    return (
      <DashboardLayout>
        <p>Knowledge not found.</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div>
        <PageHeader
          title={knowledge.title}
          actions={
            <Link
              href={`/knowledge/${knowledge.id}/edit`}
              className="border-border bg-surface hover:bg-surface-elevated inline-flex items-center gap-2 rounded-lg border px-4 py-2 transition-colors"
            >
              <Pencil size={16} aria-hidden="true" />
              Edit
            </Link>
          }
        />
        {knowledge.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {knowledge.tags.map((tag) => (
              <span
                key={tag}
                className="border-border rounded-md border px-3 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
        <div className="min-w-0 space-y-6">
          <KnowledgeDescription
            description={knowledge.description}
            createdAt={knowledge.createdAt}
            updatedAt={knowledge.updatedAt}
          />
          <div className="flex flex-col gap-8">
            <KnowledgeConnection knowledgeId={id} />
            <KnowledgeResources knowledgeId={id} />
          </div>
        </div>
        <div className="min-w-0 xl:sticky xl:top-6">
          <KnowledgeMetrics
            knowledgeId={id}
            tags={knowledge.tags}
            updatedAt={knowledge.updatedAt}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
export default KnowledgeDetailsPage
