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
