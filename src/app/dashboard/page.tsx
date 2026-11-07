"use client"

import { useSyncExternalStore } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import KnowledgeMetrics from "@/components/features/dashboard/KnowledgeMetrics"
import GraphPreview from "@/components/features/dashboard/GraphPreview"
import RecentActivity from "@/components/features/dashboard/RecentActivity"
import RecentKnowledge from "@/components/features/dashboard/RecentKnowledge"
import { Network } from "lucide-react"
import Button from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import PageHeader from "@/components/layout/PageHeader"
import { ME } from "@/graphql/auth/queries"
import { useQuery } from "@apollo/client/react"

const getGreeting = () => {
  const hour = new Date().getHours()

  if (hour < 12) return "Good morning"
  if (hour < 18) return "Good afternoon"
  return "Good evening"
}

const subscribeToGreeting = (callback: () => void) => {
  const intervalId = window.setInterval(callback, 60_000)
  return () => window.clearInterval(intervalId)
}

const getServerGreeting = () => "Welcome"

const DashboardPage = () => {
  const router = useRouter()
  const { data } = useQuery(ME)
  const greeting = useSyncExternalStore(
    subscribeToGreeting,
    getGreeting,
    getServerGreeting,
  )
  const name = data?.me?.name.trim()

  return (
    <DashboardLayout>
      <PageHeader
        title={`${greeting}${name ? `, ${name}` : ""}`}
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
