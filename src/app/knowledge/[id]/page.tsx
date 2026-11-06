"use client"
import KnowledgeConnection from "@/components/features/knowledge/KnowledgeConnection"
import KnowledgeDescription from "@/components/features/knowledge/KnowledgeDescription"
import KnowledgeMetrics from "@/components/features/knowledge/KnowledgeMetrics"
import KnowledgeResources from "@/components/features/knowledge/KnowledgeResources"
import KnowledgeTitle from "@/components/features/knowledge/KnowledgeTitle"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { GET_KNOWLEDGE_BY_ID } from "@/graphql/knowledge/queries"
import { useQuery } from "@apollo/client/react"
import { useParams } from "next/navigation"

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
      <KnowledgeTitle title={knowledge.title} tags={knowledge.tags} />
      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[minmax(0,3fr)_minmax(260px,1fr)]">
        <div className="min-w-0 space-y-6">
          <KnowledgeDescription
            description={knowledge.description}
            createdAt={knowledge.createdAt}
            updatedAt={knowledge.updatedAt}
          />
          <KnowledgeConnection knowledgeId={id} />
          <KnowledgeResources knowledgeId={id} />
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
