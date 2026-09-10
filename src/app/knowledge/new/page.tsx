import DashboardLayout from "@/components/layout/DashboardLayout"
import KnowledgeForm from "@/app/features/knowledge/components/KnowledgeForm"
import PageHeading from "@/components/layout/PageHeading"

const NewKnowledge = () => {
  return (
    <DashboardLayout>
      <PageHeading
        title="Add Knowledge"
        description=" Capture a concept, technology, tool, or idea and add it to your
        knowledge graph."
      />
      <KnowledgeForm />
    </DashboardLayout>
  )
}
export default NewKnowledge
