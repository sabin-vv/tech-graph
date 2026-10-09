import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client"
import { SetContextLink } from "@apollo/client/link/context"
import { getAuthToken } from "./auth"

const httpLink = new HttpLink({
  uri: "http://localhost:4000/graphql",
})

const authLink = new SetContextLink((prevContext) => {
  const token = getAuthToken()

  return {
    headers: {
      ...prevContext.headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  }
})

export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})
