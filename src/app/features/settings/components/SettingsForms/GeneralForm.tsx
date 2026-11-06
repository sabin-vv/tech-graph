"use client"

import Button from "@/components/ui/Button"
import Select from "@/components/ui/Select"
import { FormEvent, useMemo, useState, useSyncExternalStore } from "react"

const STORAGE_KEY = "techgraph.generalPreferences"
const STORAGE_EVENT = "techgraph-general-preferences-change"
const STORAGE_READ_ERROR = "__techgraph_storage_read_error__"

const languageOptions = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "ko", label: "Korean" },
  { value: "ja", label: "Japanese" },
  { value: "hi", label: "Hindi" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
]

const timeZoneOptions = [
  { value: "local", label: "Use device time zone" },
  { value: "UTC", label: "UTC" },
]

const dateFormatOptions = [
  { value: "yyyy-MM-dd", label: "YYYY-MM-DD (2026-11-06)" },
  { value: "MM/dd/yyyy", label: "MM/DD/YYYY (11/06/2026)" },
  { value: "dd/MM/yyyy", label: "DD/MM/YYYY (06/11/2026)" },
]

interface GeneralPreferences {
  language: string
  timeZone: string
  dateFormat: string
}

const DEFAULT_PREFERENCES: GeneralPreferences = {
  language: "en",
  timeZone: "local",
  dateFormat: "yyyy-MM-dd",
}

const subscribeToPreferences = (callback: () => void) => {
  window.addEventListener("storage", callback)
  window.addEventListener(STORAGE_EVENT, callback)
  return () => {
    window.removeEventListener("storage", callback)
    window.removeEventListener(STORAGE_EVENT, callback)
  }
}

const getPreferencesSnapshot = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY)
  } catch {
    return STORAGE_READ_ERROR
  }
}

const getServerPreferencesSnapshot = () => null

const parseGeneralPreferences = (
  value: unknown,
): GeneralPreferences | null => {
  if (typeof value !== "object" || value === null) return null

  const preferences = value as Record<string, unknown>
  const language =
    languageOptions.find(
      (option) => option.value === (preferences.language ?? "en"),
    )?.value ?? null
  const timeZone = timeZoneOptions.find(
    (option) => option.value === preferences.timeZone,
  )?.value
  const dateFormat = dateFormatOptions.find(
    (option) => option.value === preferences.dateFormat,
  )?.value

  if (!language || !timeZone || !dateFormat) return null

  return { language, timeZone, dateFormat }
}

const GeneralForm = () => {
  const storedPreferences = useSyncExternalStore(
    subscribeToPreferences,
    getPreferencesSnapshot,
    getServerPreferencesSnapshot,
  )
  const [draftPreferences, setDraftPreferences] =
    useState<GeneralPreferences | null>(null)
  const [status, setStatus] = useState("")
  const [saveError, setSaveError] = useState("")
  const storedState = useMemo(() => {
    if (storedPreferences === STORAGE_READ_ERROR) {
      return {
        preferences: DEFAULT_PREFERENCES,
        error: "Unable to access preferences in this browser.",
      }
    }

    if (!storedPreferences) {
      return { preferences: DEFAULT_PREFERENCES, error: "" }
    }

    try {
      const parsed: unknown = JSON.parse(storedPreferences)
      const preferences = parseGeneralPreferences(parsed)
      if (!preferences) {
        throw new Error("Saved general preferences have an invalid format.")
      }
      return { preferences, error: "" }
    } catch {
      return {
        preferences: DEFAULT_PREFERENCES,
        error:
          "Saved preferences are invalid. Reset them by saving new values.",
      }
    }
  }, [storedPreferences])
  const preferences = draftPreferences ?? storedState.preferences
  const error = storedState.error || saveError

  const handleSave = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError("")

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      window.dispatchEvent(new Event(STORAGE_EVENT))
      setDraftPreferences(null)
      setStatus("Preferences saved in this browser.")
    } catch (saveError) {
      console.error("Unable to save general preferences", saveError)
      setStatus("")
      setSaveError("Unable to save preferences in this browser.")
    }
  }

  const handleCancel = () => {
    setDraftPreferences(null)
    setStatus("")
    setSaveError("")
  }

  const hasChanges = draftPreferences !== null

  return (
    <section className="border-border bg-surface rounded-xl border p-5 sm:p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">General preferences</h2>
        <p className="text-text-secondary mt-1 text-sm">
          Set the formats used for your TechGraph experience.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Language"
            options={languageOptions}
            value={preferences.language}
            onChange={(language) => {
              setDraftPreferences((current) => ({
                ...(current ?? preferences),
                language,
              }))
              setStatus("")
              setSaveError("")
            }}
            helperText="This saves your preference; translations are not enabled yet."
          />

          <Select
            label="Time zone"
            options={timeZoneOptions}
            value={preferences.timeZone}
            onChange={(timeZone) => {
              setDraftPreferences((current) => ({
                ...(current ?? preferences),
                timeZone,
              }))
              setStatus("")
              setSaveError("")
            }}
          />

          <div className="sm:col-span-2 sm:max-w-md">
            <Select
              label="Date format"
              options={dateFormatOptions}
              value={preferences.dateFormat}
              onChange={(dateFormat) => {
                setDraftPreferences((current) => ({
                  ...(current ?? preferences),
                  dateFormat,
                }))
                setStatus("")
                setSaveError("")
              }}
            />
          </div>
        </div>

        <div className="border-border flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div aria-live="polite">
            {error ? (
              <p className="text-sm text-red-400" role="alert">
                {error}
              </p>
            ) : (
              <p className="text-text-muted text-xs">
                Preferences are stored only in this browser.
                {status && <span className="text-green-400"> {status}</span>}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={!hasChanges}
            >
              Reset
            </Button>
            <Button type="submit" disabled={!hasChanges}>
              Save changes
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default GeneralForm
