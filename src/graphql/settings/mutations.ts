import { graphql } from "@/generated/graphql"

export const UPDATE_USER_SETTINGS = graphql(`
  mutation UpdateUserSettings($input: UpdateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      language
      timeZone
      dateFormat
      theme
      accentColor
      inAppNotifications
      emailNotifications
    }
  }
`)
