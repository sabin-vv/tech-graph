"use client"

import { useState } from "react"
import { settingsNavItems } from "./settings.constants"
import GeneralForm from "./SettingsForms/GeneralForm"
import AppearanceForm from "./SettingsForms/AppearanceForm"
import NotificationForm from "./SettingsForms/NotificationForm"
import PrivacyAndDataForm from "./SettingsForms/PrivacyAndDataForm"
import Button from "@/components/ui/Button"

const formMap: Record<string, React.ComponentType> = {
  General: GeneralForm,
  Appearance: AppearanceForm,
  Notifications: NotificationForm,
  "Privacy & Data": PrivacyAndDataForm,
}

const SettingsItemForms = () => {
  const [selectedSection, setSelectedSection] = useState("General")
  const ActiveForm = formMap[selectedSection]

  return (
    <section className="min-w-0">
      <nav
        aria-label="Settings sections"
        className="border-border flex gap-1 overflow-x-auto border-b px-2"
      >
        {settingsNavItems.map((item) => (
          <Button
            variant="ghost"
            size="md"
            type="button"
            key={item.title}
            aria-pressed={selectedSection === item.title}
            onClick={() => setSelectedSection(item.title)}
            className={`inline-flex shrink-0 items-center gap-2 rounded-t-none border-x-0 border-t-0 border-b-2 px-4 text-sm font-medium transition-colors ${
              selectedSection === item.title
                ? "border-b-primary text-foreground rounded-b-md"
                : "text-text-secondary hover:bg-surface-hover hover:text-foreground rounded-b-none border-b-transparent"
            }`}
          >
            <item.icon size={18} aria-hidden="true" />
            {item.title}
          </Button>
        ))}
      </nav>

      <div className="mt-6 min-w-0">{ActiveForm ? <ActiveForm /> : null}</div>
    </section>
  )
}
export default SettingsItemForms
