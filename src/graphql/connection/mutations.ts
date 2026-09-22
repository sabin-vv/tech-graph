import { graphql } from "@/generated/graphql"

export const CREATE_CONNECTION = graphql(`
  mutation CreateConnection($input: CreateConnectionInput!) {
    createConnection(input: $input) {
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

export const UPDATE_CONNECTION = graphql(`
  mutation UpdateConnection($id: ID!, $input: UpdateConnectionInput) {
    updateConnection(id: $id, input: $input) {
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

export const DELETE_CONNECTION = graphql(`
  mutation DeleteConnection($id: ID!) {
    deleteConnection(id: $id)
  }
`)
