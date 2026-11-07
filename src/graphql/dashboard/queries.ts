import { graphql } from "@/generated/graphql"

export const GET_DASHBOARD_SUMMARY = graphql(`
  query GetDashboardSummary {
    dashboardSummary {
      knowledgeCount
      connectionCount
      resourceCount
      uniqueTagCount
    }
  }
`)

export const GET_RECENT_KNOWLEDGE = graphql(`
  query GetRecentKnowledge {
    knowledge {
      id
      title
      type
      tags
      updatedAt
    }
  }
`)

export const GET_RECENT_KNOWLEDGE_CONNECTIONS = graphql(`
  query GetRecentKnowledgeConnections {
    connections {
      source {
        id
      }
      target {
        id
      }
    }
  }
`)
