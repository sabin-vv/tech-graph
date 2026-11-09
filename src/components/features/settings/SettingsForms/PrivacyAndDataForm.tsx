"use client"

import { useMutation } from "@apollo/client/react"
import { useState } from "react"
import type { SubmitEvent } from "react"
import Button from "@/components/ui/Button"
import Modal from "@/components/ui/Modal"
import Password from "@/components/ui/Password"
import { CHANGE_PASSWORD } from "@/graphql/auth/mutations"
import { changePasswordSchema } from "@/schemas/auth.schema"

type PasswordFormValues = {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const EMPTY_PASSWORD_FORM: PasswordFormValues = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
}

const PrivacyAndDataForm = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [changePassword, { loading: savingPassword }] =
    useMutation(CHANGE_PASSWORD)
  const [passwordValues, setPasswordValues] =
    useState<PasswordFormValues>(EMPTY_PASSWORD_FORM)
  const [passwordErrors, setPasswordErrors] = useState<
    Partial<Record<keyof PasswordFormValues, string>>
  >({})
  const [passwordError, setPasswordError] = useState("")
  const [passwordChanged, setPasswordChanged] = useState(false)

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false)
    setPasswordValues(EMPTY_PASSWORD_FORM)
    setPasswordErrors({})
    setPasswordError("")
    setPasswordChanged(false)
  }

  const handlePasswordChange = async (
    event: SubmitEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()
    setPasswordError("")

    const parsed = changePasswordSchema.safeParse(passwordValues)
    if (!parsed.success) {
      setPasswordErrors(
        parsed.error.issues.reduce<
          Partial<Record<keyof PasswordFormValues, string>>
        >((errors, issue) => {
          const field = issue.path[0]
          if (
            (field === "currentPassword" ||
              field === "newPassword" ||
              field === "confirmPassword") &&
            !errors[field]
          ) {
            errors[field] = issue.message
          }
          return errors
        }, {}),
      )
      return
    }

    setPasswordErrors({})
    try {
      await changePassword({
        variables: {
          currentPassword: parsed.data.currentPassword,
          newPassword: parsed.data.newPassword,
        },
      })
      setPasswordChanged(true)
      setPasswordValues(EMPTY_PASSWORD_FORM)
    } catch (error) {
      console.error("Unable to change password", error)
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Unable to change password. Please try again.",
      )
    }
  }

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
              Manage your account password.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setPasswordChanged(false)
              setIsPasswordModalOpen(true)
            }}
          >
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

      <Modal
        open={isPasswordModalOpen}
        onClose={closePasswordModal}
        title="Change password"
        description="Enter your current password and choose a new one."
        size="sm"
        footer={
          <div className="flex justify-end">
            {passwordChanged ? (
              <Button type="button" onClick={closePasswordModal}>
                Done
              </Button>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closePasswordModal}
                  disabled={savingPassword}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="change-password-form"
                  loading={savingPassword}
                >
                  Update password
                </Button>
              </div>
            )}
          </div>
        }
      >
        {passwordChanged ? (
          <p className="text-sm text-green-400" role="status">
            Your password has been updated.
          </p>
        ) : (
          <form
            id="change-password-form"
            onSubmit={handlePasswordChange}
            className="space-y-4"
          >
            <Password
              label="Current password"
              autoComplete="current-password"
              value={passwordValues.currentPassword}
              error={passwordErrors.currentPassword}
              disabled={savingPassword}
              onChange={(event) => {
                setPasswordValues((current) => ({
                  ...current,
                  currentPassword: event.currentTarget.value,
                }))
                setPasswordErrors((current) => ({
                  ...current,
                  currentPassword: undefined,
                }))
                setPasswordError("")
              }}
            />
            <Password
              label="New password"
              autoComplete="new-password"
              helperText="At least 8 characters, including uppercase, lowercase, and a number."
              value={passwordValues.newPassword}
              error={passwordErrors.newPassword}
              disabled={savingPassword}
              onChange={(event) => {
                setPasswordValues((current) => ({
                  ...current,
                  newPassword: event.currentTarget.value,
                }))
                setPasswordErrors((current) => ({
                  ...current,
                  newPassword: undefined,
                }))
                setPasswordError("")
              }}
            />
            <Password
              label="Confirm new password"
              autoComplete="new-password"
              value={passwordValues.confirmPassword}
              error={passwordErrors.confirmPassword}
              disabled={savingPassword}
              onChange={(event) => {
                setPasswordValues((current) => ({
                  ...current,
                  confirmPassword: event.currentTarget.value,
                }))
                setPasswordErrors((current) => ({
                  ...current,
                  confirmPassword: undefined,
                }))
                setPasswordError("")
              }}
            />
            {passwordError && (
              <p className="text-sm text-red-400" role="alert">
                {passwordError}
              </p>
            )}
          </form>
        )}
      </Modal>
    </section>
  )
}

export default PrivacyAndDataForm
