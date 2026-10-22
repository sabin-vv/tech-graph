import Button from "@/components/ui/Button"

const PrivacyAndDataForm = () => {
  return (
    <div className="bg-surface space-y-4 p-6">
      <div className="border-border flex items-center justify-between rounded-md border p-3">
        <h2>Change Password</h2>
        <Button variant="outline">Change</Button>
      </div>
      <span>DangerZone</span>
      <div className="border-border flex items-center justify-between border p-3">
        <h2>Delete workspace & Account</h2>
        <Button variant="destructive">Delete</Button>
      </div>
    </div>
  )
}
export default PrivacyAndDataForm
