import { Database } from "lucide-react";

const KnowledgeMetrics = () => {
  return (
    <div className="mt-7 grid grid-cols-4 gap-5">
      <StatCard />
      <StatCard />
      <StatCard />
      <StatCard />
    </div>
  );
};
export default KnowledgeMetrics;

const StatCard = () => {
  return (
    <div className="border-border flex flex-col gap-2 rounded-lg border p-4">
      <div className="flex justify-between">
        <h2 className="text-text-secondary text-xl">Total Knowledge</h2>
        <Database size={16} color="#8B7CFF" />
      </div>
      <h1 className="text-4xl">128</h1>
      <div>
        <span>+12 this week</span>
      </div>
    </div>
  );
};
