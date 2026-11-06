import { graphql } from "@/generated/graphql"

export const GET_KNOWLEDGE_FOR_CONNECTION = graphql(`
  query GetKnowledgeForConnection {
    knowledge {
      id
      title
      type
      description
    }
  }
`)

export const GET_KNOWLEDGE = graphql(`
  query GetKnowledge {
    knowledge {
      id
      title
      type
      description
      tags
    }
  }
`)

export const GET_KNOWLEDGE_FOR_EXPLORE = graphql(`
  query GetKnowledgeForExplore {
    knowledge {
      id
      title
      type
      description
      tags
      updatedAt
    }
  }
`)

export const GET_KNOWLEDGE_BY_ID = graphql(`
  query GetKnowledgeById($id: ID!) {
    knowledgeById(id: $id) {
      id
      title
      type
      description
      tags
    }
  }
`)
