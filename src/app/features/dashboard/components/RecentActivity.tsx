import { ArrowRight } from "lucide-react";

const RecentActivity = () => {
  return (
    <div className="border-border mt-7 rounded-lg border">
      <div className="bg-surface px-5 py-4">
        <h1 className="px-2 py-1 text-lg">Recent Activity</h1>
      </div>
      <div className="px-4 py-2">
        <h4 className="text-sm">
          Added new Connection GraphQL <ArrowRight size={12} /> Node
        </h4>
        <span className="text-text-secondary text-sm">2 hours ago</span>
      </div>
    </div>
  );
};
export default RecentActivity;
