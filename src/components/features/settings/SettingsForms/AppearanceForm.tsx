"use client"

import { useMutation, useQuery } from "@apollo/client/react"
import { useState } from "react"
import type { SubmitEvent } from "react"
import Button from "@/components/ui/Button"
import { USER_SETTINGS } from "@/graphql/settings/queries"
import { UPDATE_USER_SETTINGS } from "@/graphql/settings/mutations"

const themePreviews = [
  {
    name: "Light",
    value: "light",
    panel: "bg-slate-100",
    sidebar: "bg-white",
    line: "bg-slate-300",
  },
  {
    name: "Dark",
    value: "dark",
    panel: "bg-slate-950",
    sidebar: "bg-slate-900",
    line: "bg-slate-700",
  },
]

const accentColors = [
  { name: "Violet", value: "violet", swatch: "bg-violet-500" },
  { name: "Blue", value: "blue", swatch: "bg-blue-400" },
  { name: "Teal", value: "teal", swatch: "bg-teal-500" },
  { name: "Amber", value: "amber", swatch: "bg-amber-500" },
]

const AppearanceForm = () => {
  const { data, loading, error: queryError } = useQuery(USER_SETTINGS)
  const [updateUserSettings, { loading: saving }] =
    useMutation(UPDATE_USER_SETTINGS)
  const [draftPreferences, setDraftPreferences] = useState<{
    theme: string
    accentColor: string
  } | null>(null)

  const [saveError, setSaveError] = useState("")
  const savedPreferences = data?.userSettings
  const preferences = draftPreferences ?? {
    theme: savedPreferences?.theme ?? "dark",
    accentColor: savedPreferences?.accentColor ?? "violet",
  }
  const error = saveError || queryError?.message
  const selectedTheme = preferences.theme
  const selectedAccent = preferences.accentColor
  const accentSwatch =
    accentColors.find((color) => color.value === selectedAccent)?.swatch ??
    accentColors[0].swatch

  const handleSave = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaveError("")

    try {
      await updateUserSettings({
        variables: {
          input: {
            theme: preferences.theme,
            accentColor: preferences.accentColor,
          },
        },
        refetchQueries: [{ query: USER_SETTINGS }],
      })
      setDraftPreferences(null)
    } catch (error) {
      console.error("Unable to save appearance preferences", error)
    }
  }

  const handleCancel = () => {
    setDraftPreferences(null)

    setSaveError("")
  }

  const hasChanges = draftPreferences !== null

  return (
    <section className="border-border bg-surface rounded-xl border p-5 sm:p-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Appearance</h2>
          <p className="text-text-secondary mt-1 text-sm">
            Preview the available theme and accent styles.
          </p>
        </div>
        <span className="border-border text-text-secondary rounded-full border px-2.5 py-1 text-xs">
          Preview
        </span>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <section>
          <h3 className="mb-3 text-sm font-medium">Interface theme</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {themePreviews.map((theme) => (
              <button
                type="button"
                key={theme.name}
                aria-pressed={selectedTheme === theme.value}
                onClick={() => {
                  setDraftPreferences((current) => ({
                    ...(current ?? preferences),
                    theme: theme.value,
                  }))

                  setSaveError("")
                }}
                className={`border-border hover:bg-surface-hover focus-visible:outline-primary w-full rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  selectedTheme === theme.value
                    ? "border-primary ring-primary/40 ring-1"
                    : ""
                }`}
              >
                <div
                  className={`flex h-24 overflow-hidden rounded-md border border-black/10 ${theme.panel}`}
                  aria-hidden="true"
                >
                  <div className={`w-1/4 p-2 ${theme.sidebar}`}>
                    <div className={`h-2 w-8 rounded ${theme.line}`} />
                    <div className={`mt-2 h-2 w-6 rounded ${accentSwatch}`} />
                    <div className={`mt-2 h-2 w-7 rounded ${theme.line}`} />
                  </div>
                  <div className="flex-1 p-3">
                    <div className={`h-2 w-1/2 rounded ${theme.line}`} />
                    <div className={`mt-3 h-10 rounded ${theme.sidebar}`}>
                      <div className={`m-2 h-2 w-8 rounded ${accentSwatch}`} />
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-medium">{theme.name}</span>
                  {selectedTheme === theme.value && (
                    <span className="text-primary text-xs">Selected</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-3 text-sm font-medium">Accent color</h3>
          <div className="flex flex-wrap gap-2">
            {accentColors.map((color) => (
              <button
                key={color.value}
                type="button"
                aria-pressed={selectedAccent === color.value}
                onClick={() => {
                  setDraftPreferences((current) => ({
                    ...(current ?? preferences),
                    accentColor: color.value,
                  }))

                  setSaveError("")
                }}
                className={`focus-visible:outline-primary inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 ${
                  selectedAccent === color.value
                    ? "border-primary bg-primary-muted text-foreground"
                    : "border-border text-text-secondary hover:bg-surface-hover"
                }`}
              >
                <span
                  className={`h-4 w-4 rounded-full ${color.swatch}`}
                  aria-hidden="true"
                />
                <span className="text-sm">{color.name}</span>
              </button>
            ))}
          </div>
        </section>
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
                  : "Selections are previewed here and saved to your account."}
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
            <Button type="submit" disabled={!hasChanges || saving || loading}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default AppearanceForm
