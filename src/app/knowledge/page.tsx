"use client"

import Link from "next/link"
import { Plus } from "lucide-react"
import { gql } from "@apollo/client"
import { useMutation, useQuery } from "@apollo/client/react"
import Button from "@/components/ui/Button"
import KnowledgeCardGrid from "@/components/features/knowledge/KnowledgeCardGrid"
import PageHeader from "@/components/layout/PageHeader"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { GET_KNOWLEDGE } from "@/graphql/knowledge/queries"

const KnowledgePage = () => {
  const { data, loading, error, refetch } = useQuery(GET_KNOWLEDGE)
  const [deleteKnowledge, { loading: deleting }] = useMutation(DELETE_KNOWLEDGE)
  const knowledge = data?.knowledge ?? []

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this knowledge item? This cannot be undone.")) {
      return
    }

    try {
      await deleteKnowledge({ variables: { id } })
      await refetch()
    } catch (deleteError) {
      window.alert(
        deleteError instanceof Error
          ? deleteError.message
          : "Unable to delete knowledge.",
      )
    }
  }

  return (
    <DashboardLayout>
      <PageHeader
        title="My Knowledge"
        description="Manage the concepts, technologies, and ideas in your collection."
        actions={
          <Link
            href="/knowledge/new"
            className="bg-primary text-white hover:bg-primary-hover inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus size={16} aria-hidden="true" />
            Add knowledge
          </Link>
        }
      />

      {loading && (
        <p className="text-text-secondary" role="status">
          Loading your knowledge...
        </p>
      )}

      {error && (
        <div className="flex flex-wrap items-center gap-3" role="alert">
          <p className="text-red-400">
            Unable to load your knowledge. Please try again.
          </p>
          <Button variant="outline" onClick={() => void refetch()}>
            Try again
          </Button>
        </div>
      )}

      {!loading && !error && knowledge.length === 0 && (
        <section className="border-border bg-surface rounded-xl border p-8 text-center">
          <h2 className="text-lg font-semibold">Your collection is empty</h2>
          <p className="text-text-secondary mt-2 text-sm">
            Add your first concept, technology, or idea to get started.
          </p>
          <Link
            href="/knowledge/new"
            className="bg-primary text-white hover:bg-primary-hover mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors"
          >
            <Plus size={16} aria-hidden="true" />
            Add knowledge
          </Link>
        </section>
      )}

      {!loading && !error && knowledge.length > 0 && (
        <>
          <p className="text-text-secondary text-sm" aria-live="polite">
            {knowledge.length} {knowledge.length === 1 ? "item" : "items"}
          </p>
          <KnowledgeCardGrid
            knowledge={knowledge}
            management
            onDelete={deleting ? undefined : handleDelete}
          />
        </>
      )}
    </DashboardLayout>
  )
}

const DELETE_KNOWLEDGE = gql`
  mutation DeleteKnowledge($id: ID!) {
    deleteKnowledge(id: $id)
  }
`

export default KnowledgePage
