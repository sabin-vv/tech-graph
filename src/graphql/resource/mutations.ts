import { graphql } from "@/generated/graphql"

export const CREATE_RESOURCE = graphql(`
  mutation CreateResource($input: CreateResourceInput!) {
    createResource(input: $input) {
      id
      userId
      knowledgeId
      title
      type
      url
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

export const UPDATE_RESOURCE = graphql(`
  mutation UpdateResource($id: ID!, $input: UpdateResourceInput!) {
    updateResource(id: $id, input: $input) {
      id
      userId
      knowledgeId
      title
      type
      url
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

export const DELETE_RESOURCE = graphql(`
  mutation DeleteResource($id: ID!) {
    deleteResource(id: $id)
  }
`)
