import { graphql } from "@/generated/graphql"

export const ME = graphql(`
  query ME {
    me {
      id
      name
      email
    }
  }
`)
