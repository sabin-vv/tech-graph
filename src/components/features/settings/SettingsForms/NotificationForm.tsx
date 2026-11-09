"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import { useState } from "react"
import Toggler from "@/components/ui/Toggler"
import { USER_SETTINGS } from "@/graphql/settings/queries"
import { UPDATE_USER_SETTINGS } from "@/graphql/settings/mutations"

type NotificationPreferences = {
  inAppNotifications: boolean
  emailNotifications: boolean
}

type NotificationField = keyof NotificationPreferences

const notificationOptions: {
  id: string
  title: string
  description: string
  field: NotificationField
}[] = [
  {
    id: "in-app-notifications",
    title: "In-app notifications",
    description: "Updates and activity shown inside TechGraph.",
    field: "inAppNotifications",
  },
  {
    id: "email-notifications",
    title: "Email notifications",
    description: "Important updates sent to your email address.",
    field: "emailNotifications",
  },
]

const NotificationForm = () => {
  const { data, loading, error: queryError } = useQuery(USER_SETTINGS)
  const [updateUserSettings, { loading: saving }] =
    useMutation(UPDATE_USER_SETTINGS)
  const [localPreferences, setLocalPreferences] =
    useState<NotificationPreferences | null>(null)
  const [saveError, setSaveError] = useState("")
  const [status, setStatus] = useState("")
  const savedPreferences = data?.userSettings
  const preferences = localPreferences ?? {
    inAppNotifications: savedPreferences?.inAppNotifications ?? false,
    emailNotifications: savedPreferences?.emailNotifications ?? false,
  }

  const handleToggle = async (field: NotificationField, checked: boolean) => {
    const previousValue = preferences[field]
    setLocalPreferences((current) => ({
      ...(current ?? preferences),
      [field]: checked,
    }))
    setSaveError("")
    setStatus("")

    try {
      await updateUserSettings({
        variables: { input: { [field]: checked } },
        refetchQueries: [{ query: USER_SETTINGS }],
      })
      setStatus("Preference saved.")
    } catch (error) {
      console.error("Unable to save notification preference", error)
      setLocalPreferences((current) => ({
        ...(current ?? preferences),
        [field]: previousValue,
      }))
      setSaveError("Unable to save this preference. Please try again.")
    }
  }

  const error = saveError || queryError?.message

  return (
    <section className="border-border bg-surface rounded-xl border p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Choose which notification preferences to enable.
        </p>
      </div>

      <div className="space-y-3">
        {notificationOptions.map((item) => (
          <label
            key={item.id}
            htmlFor={item.id}
            className="border-border hover:bg-surface-hover flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors"
          >
            <span>
              <span className="block text-sm font-medium">{item.title}</span>
              <span className="text-text-secondary mt-1 block text-sm">
                {item.description}
              </span>
            </span>
            <Toggler
              id={item.id}
              checked={preferences[item.field]}
              disabled={loading || saving}
              onChange={(event) =>
                void handleToggle(item.field, event.currentTarget.checked)
              }
            />
          </label>
        ))}
      </div>

      <div className="text-text-muted mt-4 border-t border-border pt-4 text-xs" aria-live="polite">
        {error ? (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        ) : (
          <p>
            {loading
              ? "Loading account preferences…"
              : saving
                ? "Saving preference…"
                : "Notification preferences are saved to your account."}
            {status && <span className="text-green-400"> {status}</span>}
          </p>
        )}
      </div>
    </section>
  )
}

export default NotificationForm
