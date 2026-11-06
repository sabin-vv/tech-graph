"use client"

import { useParams } from "next/navigation"
import KnowledgeForm from "@/components/features/knowledge/KnowledgeForm"
import DashboardLayout from "@/components/layout/DashboardLayout"
import PageHeader from "@/components/layout/PageHeader"

const Editknowledge = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <PageHeader
          title="Edit Knowledge"
          description="Capture a concept, technology, tool, or idea and add it to your
            knowledge graph."
        />

        <KnowledgeForm knowledgeId={id} />
      </div>
    </DashboardLayout>
  )
}
export default Editknowledge
