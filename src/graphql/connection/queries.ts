import { graphql } from "@/generated/graphql"

export const GET_CONNECTIONS = graphql(`
  query GetConnections {
    connections {
      id
      userId
      relation
      source {
        id
        title
        type
      }
      target {
        id
        title
        type
      }
      createdAt
      updatedAt
    }
  }
`)

export const GET_CONNECTIONS_BY_KNOWLEDGE = graphql(`
  query GetConnectionsByKnowledge($id: ID!) {
    connectionsByKnowledge(id: $id) {
      id
      userId
      relation
      source {
        id
        title
        type
      }
      target {
        id
        title
        type
      }
      createdAt
      updatedAt
    }
  }
`)
