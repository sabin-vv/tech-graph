import { graphql } from "@/generated/graphql"

export const GET_RESOURCES = graphql(`
  query GetResources {
    resources {
      id
      userId
      knowledgeId
      title
      url
      type
      description
      user {
        id
        name
      }
      knowledge {
        id
        title
        type
      }
      createdAt
      updatedAt
    }
  }
`)

export const GET_RESOURCE_BY_KNOWLEDGE = graphql(`
  query GetResourcesByKnowledge($id: ID!) {
    resourcesByKnowledge(id: $id) {
      id
      userId
      knowledgeId
      title
      url
      type
      description
      user {
        id
        name
      }
      knowledge {
        id
        title
        type
      }
      createdAt
      updatedAt
    }
  }
`)
