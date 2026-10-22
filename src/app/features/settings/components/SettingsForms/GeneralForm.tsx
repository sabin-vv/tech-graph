"use client"

import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"

const GeneralForm = () => {
  return (
    <div className="border-border border">
      <form className="bg-surface space-y-6 p-6">
        <Input label="Language" />
        <Input label="Timezone" />
        <Input label="Date Format" />
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </form>
    </div>
  )
}
export default GeneralForm
