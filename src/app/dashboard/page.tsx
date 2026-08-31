import DashboardLayout from "@/components/layout/DashboardLayout";
import DashboardHeader from "../features/dashboard/components/DashboardHeader";
import KnowledgeMetrics from "../features/dashboard/components/KnowledgeMetrics";
import GraphPreview from "../features/dashboard/components/GraphPreview";
import RecentActivity from "../features/dashboard/components/RecentActivity";
import RecentKnowledge from "../features/dashboard/components/RecentKnowledge";

const DashboardPage = () => {
  return (
    <DashboardLayout>
      <DashboardHeader />
      <KnowledgeMetrics />
      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3">
          <GraphPreview />
        </div>
        <div className="col-span-1">
          <RecentActivity />
        </div>
      </div>
      <RecentKnowledge />
    </DashboardLayout>
  );
};
export default DashboardPage;
