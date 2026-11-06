"use client"

import { useState } from "react"

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
  const [selectedTheme, setSelectedTheme] = useState("dark")
  const [selectedAccent, setSelectedAccent] = useState("violet")
  const accentSwatch =
    accentColors.find((color) => color.value === selectedAccent)?.swatch ??
    accentColors[0].swatch

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

      <div className="space-y-6">
        <section>
          <h3 className="mb-3 text-sm font-medium">Interface theme</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {themePreviews.map((theme) => (
              <button
                type="button"
                key={theme.name}
                aria-pressed={selectedTheme === theme.value}
                onClick={() => setSelectedTheme(theme.value)}
                className={`border-border w-full rounded-lg border p-3 text-left transition-colors hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
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
                    <div
                      className={`mt-2 h-2 w-6 rounded ${accentSwatch}`}
                    />
                    <div className={`mt-2 h-2 w-7 rounded ${theme.line}`} />
                  </div>
                  <div className="flex-1 p-3">
                    <div className={`h-2 w-1/2 rounded ${theme.line}`} />
                    <div className={`mt-3 h-10 rounded ${theme.sidebar}`}>
                      <div
                        className={`m-2 h-2 w-8 rounded ${accentSwatch}`}
                      />
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
                onClick={() => setSelectedAccent(color.value)}
                className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
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
      </div>

      <p className="text-text-muted mt-5 border-t border-border pt-4 text-xs">
        Selections update the preview only. They are not saved or applied to the
        rest of the app.
      </p>
    </section>
  )
}

export default AppearanceForm
