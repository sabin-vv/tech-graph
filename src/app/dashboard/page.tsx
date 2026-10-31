"use client"
import DashboardLayout from "@/components/layout/DashboardLayout"
import KnowledgeMetrics from "@/components/features/dashboard/KnowledgeMetrics"
import GraphPreview from "@/components/features/dashboard/GraphPreview"
import RecentActivity from "@/components/features/dashboard/RecentActivity"
import RecentKnowledge from "@/components/features/dashboard/RecentKnowledge"

import { Network } from "lucide-react"
import Button from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/layout/PageHeader"

const DashboardPage = () => {
  const router = useRouter()
  return (
    <DashboardLayout>
      <PageHeader
        title={`Good Morning, Sabin`}
        description="Ready to expand your knowledge network today?"
        actions={
          <Button
            className="flex items-center justify-center gap-2"
            variant="outline"
            onClick={() => router.replace("/graph")}
          >
            <Network size={18} />
            Explore Graph
          </Button>
        }
      />

      <KnowledgeMetrics />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-10">
        <div className="min-w-0 lg:col-span-7">
          <GraphPreview />
        </div>
        <div className="min-w-0 lg:col-span-3">
          <RecentActivity />
        </div>
      </div>
      <RecentKnowledge />
    </DashboardLayout>
  )
}
export default DashboardPage
