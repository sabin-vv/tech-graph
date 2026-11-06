"use client"

import { useState } from "react"
import Toggler from "@/components/ui/Toggler"

const notificationOptions = [
  {
    id: "in-app-notifications",
    title: "In-app notifications",
    description: "Updates and activity shown inside TechGraph.",
  },
  {
    id: "email-notifications",
    title: "Email notifications",
    description: "Important updates sent to your email address.",
  },
]

const NotificationForm = () => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>({})

  return (
    <section className="border-border bg-surface rounded-xl border p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Preview notification preferences.
        </p>
      </div>

      <div className="space-y-3">
        {notificationOptions.map((item) => {
          const isEnabled = enabled[item.id] ?? false

          return (
            <label
              key={item.id}
              htmlFor={item.id}
              className="border-border flex cursor-pointer items-center justify-between gap-4 rounded-lg border p-4 transition-colors hover:bg-surface-hover"
            >
              <span>
                <span className="block text-sm font-medium">{item.title}</span>
                <span className="text-text-secondary mt-1 block text-sm">
                  {item.description}
                </span>
              </span>
              <Toggler
                id={item.id}
                checked={isEnabled}
                onChange={(event) =>
                  setEnabled((current) => ({
                    ...current,
                    [item.id]: event.target.checked,
                  }))
                }
              />
            </label>
          )
        })}
      </div>
      <p className="text-text-muted mt-4 border-t border-border pt-4 text-xs">
        Toggles are a local preview only. They are not saved and will not send
        notifications.
      </p>
    </section>
  )
}

export default NotificationForm
