"use client"

import { ApolloProvider } from "@apollo/client/react"
import { client } from "@/lib/apollo"
import { AuthProvider } from "@/components/auth/AuthContext"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </ApolloProvider>
  )
}
