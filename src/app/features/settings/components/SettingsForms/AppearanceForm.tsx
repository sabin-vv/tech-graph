"use client"

const AppearanceForm = () => {
  return (
    <div className="border-border border">
      <form className="bg-surface space-y-4 p-6">
        <span>Interface theme</span>
        <div className="flex min-w-full gap-3">
          <div className="flex flex-col">
            <div className="border-border border p-4">
              <div className="min-h-4">Placeholder</div>
              <h2>Light</h2>
            </div>
          </div>
          <div>
            <div className="border-border border p-4">
              <div className="min-h-4">Placeholder</div>
              <h2>Dark</h2>
            </div>
          </div>
        </div>
        <span>Accent colors</span>
        <div className="flex gap-4">
          <div className="border-border flex flex-col items-center justify-center border p-2">
            <div className="h-8 w-8 rounded-full bg-violet-500 p-2"></div>
            <h3>Violet</h3>
          </div>
          <div className="border-border flex flex-col items-center justify-center border p-2">
            <div className="h-8 w-8 rounded-full bg-blue-400 p-2"></div>
            <h3>Blue</h3>
          </div>
          <div className="border-border flex flex-col items-center justify-center border p-2">
            <div className="h-8 w-8 rounded-full bg-teal-500 p-2"></div>
            <h3>Teal</h3>
          </div>
          <div className="border-border flex flex-col items-center justify-center border p-2">
            <div className="h-8 w-8 rounded-full bg-amber-500 p-2"></div>
            <h3>Amber</h3>
          </div>
        </div>
      </form>
    </div>
  )
}
export default AppearanceForm
