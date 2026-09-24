import { graphql } from "@/generated/graphql"

export const GET_KNOWLEDGE_FOR_CONNECTION = graphql(`
  query GetKnowledgeForConnection {
    knowledge {
      id
      title
      type
    }
  }
`)

export const GET_KNOWLEDGE = graphql(`
  query GetKnowledge {
    knowledge {
      id
      title
      type
    }
  }
`)
