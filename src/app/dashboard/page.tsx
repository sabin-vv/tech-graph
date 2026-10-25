import DashboardLayout from "@/components/layout/DashboardLayout"
import DashboardHeader from "@/components/features/dashboard/DashboardHeader"
import KnowledgeMetrics from "@/components/features/dashboard/KnowledgeMetrics"
import GraphPreview from "@/components/features/dashboard/GraphPreview"
import RecentActivity from "@/components/features/dashboard/RecentActivity"
import RecentKnowledge from "@/components/features/dashboard/RecentKnowledge"

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <KnowledgeMetrics />
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3">
          <GraphPreview />
        </div>
        <div className="col-span-1">
          <RecentActivity />
        </div>
      </div>
      <RecentKnowledge />
    </DashboardLayout>
  )
}
export default DashboardPage
