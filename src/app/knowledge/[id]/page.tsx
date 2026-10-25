import KnowledgeConnection from "@/components/features/knowledge/KnowledgeConnection"
import KnowledgeDescription from "@/components/features/knowledge/KnowledgeDescription"
import KnowledgeMetrics from "@/components/features/knowledge/KnowledgeMetrics"
import KnowledgeResources from "@/components/features/knowledge/KnowledgeResources"
import KnowledgeTitle from "@/components/features/knowledge/KnowledgeTitle"
import DashboardLayout from "@/components/layout/DashboardLayout"

interface KnowledgeDetailsPageProps {
  params: {
    id: string
  }
}
const KnowledgeDetailsPage = async ({ params }: KnowledgeDetailsPageProps) => {
  const { id } = await params
  return (
    <DashboardLayout>
      <KnowledgeTitle />
      <div className="flex gap-4">
        <div className="w-3/4">
          <KnowledgeDescription />
          <KnowledgeConnection knowledgeId={id} />
          <KnowledgeResources knowledgeId={id} />
        </div>
        <div>
          <KnowledgeMetrics />
        </div>
      </div>
    </DashboardLayout>
  )
}
export default KnowledgeDetailsPage
