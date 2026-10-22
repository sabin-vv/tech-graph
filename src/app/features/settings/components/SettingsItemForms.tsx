"use client"

import React, { useState } from "react"
import { settingsNavItems } from "../constants/settings.constants"
import GeneralForm from "./SettingsForms/GeneralForm"
import AppearanceForm from "./SettingsForms/AppearanceForm"
import NotificationForm from "./SettingsForms/NotificationForm"
import PrivacyAndDataForm from "./SettingsForms/PrivacyAndDataForm"

const formMap: Record<string, React.ComponentType> = {
  General: GeneralForm,
  Appearance: AppearanceForm,
  Notifications: NotificationForm,
  "Privacy & Data": PrivacyAndDataForm,
}

const SettingsItemForms = () => {
  const [selectedSection, setSelectedSection] = useState("General")
  type SectionKey = keyof typeof formMap
  const ActiveForm = formMap[selectedSection]

  return (
    <div>
      <div className="flex gap-5">
        {settingsNavItems.map((item) => (
          <div
            key={item.title}
            className="space-y-5 text-[16px] hover:cursor-pointer"
            onClick={() => setSelectedSection(item.title as SectionKey)}
          >
            <span className="hover:bg-surface-hover flex items-center gap-3 rounded-md px-4 py-2.5">
              {<item.icon />}
              {item.title}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6">{ActiveForm ? <ActiveForm /> : null}</div>
    </div>
  )
}
export default SettingsItemForms
