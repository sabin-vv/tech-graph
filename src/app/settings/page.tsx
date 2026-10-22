"use client"

import DashboardLayout from "@/components/layout/DashboardLayout"
import PageHeading from "@/components/layout/PageHeading"
import SettingsItemForms from "../features/settings/components/SettingsItemForms"

const SettingsPage = () => {
  return (
    <DashboardLayout>
      <PageHeading
        title="Settings"
        description="Customize your TechGraph experience and knowledge workflow"
      />
      <SettingsItemForms />
    </DashboardLayout>
  )
}
export default SettingsPage
