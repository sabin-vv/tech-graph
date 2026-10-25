import DashboardLayout from "@/components/layout/DashboardLayout"
import KnowledgeHeader from "@/components/features/knowledge/KnowledgeHeader"
import KnowledgeCardGrid from "@/components/features/knowledge/KnowledgeCardGrid"
import KnowledgeSearch from "@/components/features/knowledge/KnowledgeSearch"
import KnowledgeFilters from "@/components/features/knowledge/KnowledgeFilters"

const ExplorePage = () => {
  return (
    <DashboardLayout>
      <KnowledgeHeader />
      <KnowledgeSearch />
      <KnowledgeFilters />
      <KnowledgeCardGrid />
    </DashboardLayout>
  )
}
export default ExplorePage
