import SettingsItemForms from "@/components/features/settings/SettingsItemForms"
import DashboardLayout from "@/components/layout/DashboardLayout"
import PageHeading from "@/components/layout/PageHeading"

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
