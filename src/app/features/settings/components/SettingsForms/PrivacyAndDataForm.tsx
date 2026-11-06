"use client"

import Button from "@/components/ui/Button"

const PrivacyAndDataForm = () => {
  return (
    <section className="border-border bg-surface rounded-xl border p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Privacy &amp; data</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Preview account security and data controls.
        </p>
      </div>

      <div className="space-y-3">
        <div className="border-border flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-medium">Change password</h3>
            <p className="text-text-secondary mt-1 text-sm">
              Preview the password management flow.
            </p>
          </div>
          <Button type="button" variant="outline">
            Change Password
          </Button>
        </div>

        <div className="flex flex-col gap-3 rounded-lg border border-red-500/30 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm font-medium">Delete account</h3>
            <p className="text-text-secondary mt-1 text-sm">
              Preview the account deletion warning.
            </p>
          </div>
          <Button type="button" variant="destructive">
            Delete Account
          </Button>
        </div>
      </div>

      <p className="text-danger border-border mt-4 border-t pt-4 text-xs">
        Danger zone
      </p>
    </section>
  )
}

export default PrivacyAndDataForm
