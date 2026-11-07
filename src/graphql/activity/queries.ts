import { graphql } from "@/generated/graphql"

export const GET_RECENT_ACTIVITY = graphql(`
  query GetRecentActivity($limit: Int, $cursor: String) {
    recentActivity(limit: $limit, cursor: $cursor) {
      items {
        id
        action
        entityType
        summary
        createdAt
      }
      nextCursor
      hasMore
    }
  }
`)
