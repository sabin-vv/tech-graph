import KnowledgeCard from "./KnowledgeCard";

const KnowledgeCardGrid = () => {
  return (
    <div className="mt-7 grid grid-cols-4 gap-4">
      <KnowledgeCard />
      <KnowledgeCard />
      <KnowledgeCard />
      <KnowledgeCard />
    </div>
  );
};
export default KnowledgeCardGrid;
