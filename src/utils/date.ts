const GENERAL_PREFERENCES_KEY = "techgraph.generalPreferences"
const DEFAULT_TIME_ZONE = "local"
const DEFAULT_DATE_FORMAT = "yyyy-MM-dd"

interface DatePreferences {
  timeZone: string
  dateFormat: string
}

function getDatePreferences(): DatePreferences {
  try {
    const stored = window.localStorage.getItem(GENERAL_PREFERENCES_KEY)
    if (!stored) {
      return {
        timeZone: DEFAULT_TIME_ZONE,
        dateFormat: DEFAULT_DATE_FORMAT,
      }
    }

    const preferences: unknown = JSON.parse(stored)
    if (typeof preferences !== "object" || preferences === null) {
      throw new Error("Saved general preferences have an invalid format.")
    }

    const values = preferences as Record<string, unknown>
    return {
      timeZone: values.timeZone === "UTC" ? "UTC" : DEFAULT_TIME_ZONE,
      dateFormat:
        values.dateFormat === "MM/dd/yyyy" ||
        values.dateFormat === "dd/MM/yyyy"
          ? values.dateFormat
          : DEFAULT_DATE_FORMAT,
    }
  } catch {
    return {
      timeZone: DEFAULT_TIME_ZONE,
      dateFormat: DEFAULT_DATE_FORMAT,
    }
  }
}

export function formatDate(
  value: string,
  options: Intl.DateTimeFormatOptions = {},
): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return "Unknown date"

  const { timeZone, dateFormat } = getDatePreferences()
  const dateParts = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: timeZone === "local" ? undefined : timeZone,
  }).formatToParts(date)
  const parts = Object.fromEntries(
    dateParts.map(({ type, value }) => [type, value]),
  )
  const formattedDate = dateFormat.replace(
    /yyyy|MM|dd/g,
    (token) => {
      const part =
        token === "yyyy" ? "year" : token === "MM" ? "month" : "day"
      return parts[part] ?? token
    },
  )

  const timeOptions: Intl.DateTimeFormatOptions = {}
  if (options.timeStyle) timeOptions.timeStyle = options.timeStyle
  if (options.hour) timeOptions.hour = options.hour
  if (options.minute) timeOptions.minute = options.minute
  if (options.second) timeOptions.second = options.second
  if (options.hour12 !== undefined) timeOptions.hour12 = options.hour12
  if (options.hourCycle) timeOptions.hourCycle = options.hourCycle
  if (options.timeZoneName) timeOptions.timeZoneName = options.timeZoneName

  if (Object.keys(timeOptions).length === 0) return formattedDate

  const formattedTime = new Intl.DateTimeFormat(undefined, {
    ...timeOptions,
    timeZone: timeZone === "local" ? undefined : timeZone,
  }).format(date)

  return `${formattedDate}, ${formattedTime}`
}
