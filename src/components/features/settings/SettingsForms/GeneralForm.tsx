"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import Button from "@/components/ui/Button"
import Select from "@/components/ui/Select"
import { USER_SETTINGS } from "@/graphql/settings/queries"
import { UPDATE_USER_SETTINGS } from "@/graphql/settings/mutations"
import { useEffect, useState } from "react"
import type { SubmitEvent } from "react"

const STORAGE_KEY = "techgraph.generalPreferences"
const STORAGE_EVENT = "techgraph-general-preferences-change"

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

const syncDatePreferences = (preferences: GeneralPreferences) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
    window.dispatchEvent(new Event(STORAGE_EVENT))
    return true
  } catch (error) {
    console.error("Unable to sync date preferences to browser storage", error)
    return false
  }
}

const GeneralForm = () => {
  const { data, loading, error: queryError } = useQuery(USER_SETTINGS)
  const [updateUserSettings, { loading: saving }] =
    useMutation(UPDATE_USER_SETTINGS)
  const [draftPreferences, setDraftPreferences] =
    useState<GeneralPreferences | null>(null)
  const [status, setStatus] = useState("")
  const [saveError, setSaveError] = useState("")
  const [storageError, setStorageError] = useState("")
  const savedPreferences = data?.userSettings
  const preferences =
    draftPreferences ??
    (savedPreferences
      ? {
          language: savedPreferences.language,
          timeZone: savedPreferences.timeZone,
          dateFormat: savedPreferences.dateFormat,
        }
      : DEFAULT_PREFERENCES)
  const error = saveError || queryError?.message || storageError

  useEffect(() => {
    if (!savedPreferences) return

    syncDatePreferences({
      language: savedPreferences.language,
      timeZone: savedPreferences.timeZone,
      dateFormat: savedPreferences.dateFormat,
    })
  }, [savedPreferences])

  const handleSave = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError("")

    try {
      await updateUserSettings({
        variables: { input: preferences },
        refetchQueries: [{ query: USER_SETTINGS }],
      })
      if (!syncDatePreferences(preferences)) {
        setStorageError(
          "Settings were saved to your account, but date preferences could not be synced in this browser.",
        )
      } else {
        setStorageError("")
      }
      setDraftPreferences(null)
      setStatus("Applied to dates throughout the app")
    } catch (error) {
      console.error("Unable to save general preferences", error)
      setStatus("")
      setSaveError("Unable to save preferences to your account.")
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
                {loading
                  ? "Loading account preferences…"
                  : "Preferences are saved to your account."}
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
            <Button type="submit" disabled={!hasChanges || saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default GeneralForm
