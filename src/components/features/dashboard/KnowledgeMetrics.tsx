"use client"
import StatCard from "@/components/ui/StatCard"
import { GET_DASHBOARD_SUMMARY } from "@/graphql/dashboard/queries"

import { useQuery } from "@apollo/client/react"
import { BookOpen, Brain, Network, Tags } from "lucide-react"
import Button from "@/components/ui/Button"

const KnowledgeMetrics = () => {
  const { data, loading, error, refetch } = useQuery(GET_DASHBOARD_SUMMARY)

  const metrics = data?.dashboardSummary
  const getValue = (value: number | undefined) => {
    if (error) return "--"
    if (loading && value === undefined) return "..."
    return value ?? "--"
  }

  return (
    <section aria-label="Knowledge metrics" aria-busy={loading}>
      {error && (
        <div
          className="mb-4 flex flex-wrap items-center gap-3"
          role="alert"
        >
          <p className="text-sm text-red-400">
            Unable to load dashboard metrics.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
          >
            Try again
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Knowledge Items"
          value={getValue(metrics?.knowledgeCount)}
          icon={<Brain />}
          footer="Everything you've saved"
        />
        <StatCard
          label="Connections"
          value={getValue(metrics?.connectionCount)}
          icon={<Network />}
          footer="Relationships between knowledge items"
        />
        <StatCard
          label="Resources saved"
          value={getValue(metrics?.resourceCount)}
          icon={<BookOpen />}
          footer="Articles, videos, documentation and more"
        />
        <StatCard
          label="Unique tags"
          value={getValue(metrics?.uniqueTagCount)}
          icon={<Tags />}
          footer="Topics used to organize knowledge"
        />
      </div>
    </section>
  )
}
export default KnowledgeMetrics
