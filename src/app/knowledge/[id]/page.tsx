import KnowledgeConnection from "@/app/features/knowledge/components/KnowledgeConnection"
import KnowledgeDescription from "@/app/features/knowledge/components/KnowledgeDescription"
import KnowledgeMetrics from "@/app/features/knowledge/components/KnowledgeMetrics"
import KnowledgeTitle from "@/app/features/knowledge/components/KnowledgeTitle"
import DashboardLayout from "@/components/layout/DashboardLayout"

const KnowledgeDetailsPage = () => {
  return (
    <DashboardLayout>
      <KnowledgeTitle />
      <div className="flex gap-4">
        <div className="w-3/4">
          <KnowledgeDescription />
          <KnowledgeConnection />
        </div>
        <div>
          <KnowledgeMetrics />
        </div>
      </div>
    </DashboardLayout>
  )
}
export default KnowledgeDetailsPage
