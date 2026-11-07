"use client"

import ActivityList from "@/components/features/activity/ActivityList"
import DashboardLayout from "@/components/layout/DashboardLayout"
import PageHeader from "@/components/layout/PageHeader"
import Button from "@/components/ui/Button"
import { GET_RECENT_ACTIVITY } from "@/graphql/activity/queries"
import { useQuery } from "@apollo/client/react"
import { useState } from "react"

const PAGE_SIZE = 20

const ActivityPage = () => {
  const [loadingMore, setLoadingMore] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState("")
  const { data, loading, error, refetch, fetchMore } = useQuery(
    GET_RECENT_ACTIVITY,
    {
      variables: { limit: PAGE_SIZE, cursor: null },
    },
  )

  const activityPage = data?.recentActivity

  const handleLoadMore = async () => {
    if (!activityPage?.hasMore || !activityPage.nextCursor || loadingMore)
      return

    setLoadingMore(true)
    setLoadMoreError("")
    try {
      await fetchMore({
        variables: {
          limit: PAGE_SIZE,
          cursor: activityPage.nextCursor,
        },
        updateQuery: (previous, { fetchMoreResult }) => {
          if (!fetchMoreResult) return previous

          return {
            recentActivity: {
              ...fetchMoreResult.recentActivity,
              items: [
                ...previous.recentActivity.items,
                ...fetchMoreResult.recentActivity.items,
              ],
            },
          }
        },
      })
    } catch (loadError) {
      console.error("Unable to load more activity", loadError)
      setLoadMoreError("Unable to load more activity. Please try again.")
    } finally {
      setLoadingMore(false)
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="Activity"
        description="A history of your knowledge, connections, and resources."
      />

      <section className="border-border bg-surface overflow-hidden rounded-xl border">
        {loading && !data && (
          <p className="text-text-secondary px-5 py-8 text-sm" role="status">
            Loading activity...
          </p>
        )}

        {error && (
          <div
            className="flex flex-col items-start gap-3 px-5 py-8"
            role="alert"
          >
            <p className="text-sm text-red-400">
              Unable to load activity. Please try again.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => void refetch()}
            >
              Try again
            </Button>
          </div>
        )}

        {!loading && !error && activityPage?.items.length === 0 && (
          <p className="text-text-secondary px-5 py-8 text-sm">
            No activity yet. Actions you take on knowledge, connections, and
            resources will appear here.
          </p>
        )}

        {!error && activityPage && activityPage.items.length > 0 && (
          <ActivityList activities={activityPage.items} />
        )}
      </section>

      {loadMoreError && (
        <p className="text-sm text-red-400" role="alert">
          {loadMoreError}
        </p>
      )}

      {activityPage?.hasMore && (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={() => void handleLoadMore()}
            loading={loadingMore}
            disabled={loadingMore}
          >
            Load more
          </Button>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ActivityPage
