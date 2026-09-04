import KnowledgeForm from "@/app/features/knowledge/components/KnowledgeForm"
import DashboardLayout from "@/components/layout/DashboardLayout"

const Editknowledge = () => {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4">
        <div className="mt-7">
          <h1 className="text-4xl">Edit Knowledge</h1>
          <h4 className="text-text-secondary">
            Capture a concept, technology, tool, or idea and add it to your
            knowledge graph.
          </h4>
        </div>
        <KnowledgeForm />
      </div>
    </DashboardLayout>
  )
}
export default Editknowledge
