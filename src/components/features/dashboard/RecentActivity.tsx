"use client"

import ActivityList from "@/components/features/activity/ActivityList"
import SectionHeader from "@/components/layout/SectionHeader"
import Button from "@/components/ui/Button"
import { GET_RECENT_ACTIVITY } from "@/graphql/activity/queries"
import { useQuery } from "@apollo/client/react"
import Link from "next/link"

const RecentActivity = () => {
  const { data, loading, error, refetch } = useQuery(GET_RECENT_ACTIVITY, {
    variables: { limit: 5, cursor: null },
  })

  const activityPage = data?.recentActivity

  return (
    <section className="border-border overflow-hidden rounded-lg border">
      <SectionHeader
        title="Recent Activity"
        description="Your latest knowledge updates"
        action={
          <Link
            href="/activity"
            className="border-border text-foreground hover:bg-surface inline-flex h-8 items-center rounded-md border px-3 text-sm font-medium transition-colors"
          >
            View all
          </Link>
        }
      />

      {loading && !data && (
        <p className="text-text-secondary px-4 py-6 text-sm" role="status">
          Loading recent activity...
        </p>
      )}

      {error && (
        <div className="flex flex-col items-start gap-3 px-4 py-6" role="alert">
          <p className="text-sm text-red-400">
            Unable to load recent activity.
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

      {!loading && !error && activityPage?.items.length === 0 && (
        <p className="text-text-secondary px-4 py-6 text-sm">
          Your activity will appear here as you add or update knowledge.
        </p>
      )}

      {!error && activityPage && activityPage.items.length > 0 && (
        <ActivityList activities={activityPage.items} />
      )}
    </section>
  )
}

export default RecentActivity
