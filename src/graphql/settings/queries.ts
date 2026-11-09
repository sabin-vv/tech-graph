import { graphql } from "@/generated/graphql"

export const USER_SETTINGS = graphql(`
  query UserSettings {
    userSettings {
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
