const KnowledgeMetrics = () => {
  return (
    <div className="border-border mt-7 rounded-lg border p-4">
      <h1 className="text-text-secondary border-border w-full border-b-2 py-2">
        KNOWLEDGE METRICS
      </h1>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-text-muted text-sm">Direct connection</h4>
          <span className="text-xl font-bold">12</span>
        </div>
        <div>
          <h4 className="text-text-muted text-sm"> Resource Linked</h4>
          <span className="text-xl font-bold">3</span>
        </div>
        <div>
          <h4 className="text-text-muted text-sm">Tags</h4>
          <span className="text-xl font-bold"> 2</span>
        </div>
        <div>
          <h4 className="text-text-muted text-sm">last updated</h4>
          <span className="text-xl font-bold">24 Oct 2026</span>
        </div>
      </div>
    </div>
  )
}
export default KnowledgeMetrics
