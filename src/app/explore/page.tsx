import DashboardLayout from "@/components/layout/DashboardLayout";
import KnowledgeHeader from "../features/knowledge/components/KnowledgeHeader";
import KnowledgeCardGrid from "../features/knowledge/components/KnowledgeCardGrid";
import KnowledgeSearch from "../features/knowledge/components/KnowledgeSearch";
import Knowledgefilters from "../features/knowledge/components/Knowledgefilters";

const ExplorePage = () => {
  return (
    <DashboardLayout>
      <KnowledgeHeader />
      <KnowledgeSearch />
      <Knowledgefilters />
      <KnowledgeCardGrid />
    </DashboardLayout>
  );
};
export default ExplorePage;
