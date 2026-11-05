import { graphql } from "@/generated/graphql"

export const GET_GRAPH_KNOWLEDGE = graphql(`
  query GetGraphKnowledge {
    knowledge {
      id
      title
      description
      type
      tags
    }
  }
`)
