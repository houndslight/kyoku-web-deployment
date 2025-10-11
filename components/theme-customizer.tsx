"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Palette } from "lucide-react"
import { storage } from "@/lib/storage"

interface ThemeCustomizerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const presetColors = [
  { name: "Aqua Mist", hex: "#91C9FF", hue: 230, chroma: 0.12 },
  { name: "Sakura Blush", hex: "#F3A6A0", hue: 15, chroma: 0.11 },
  { name: "Deep Blue", hex: "#4A90E2", hue: 240, chroma: 0.18 },
  { name: "Forest Green", hex: "#5CB85C", hue: 140, chroma: 0.16 },
  { name: "Purple", hex: "#9B59B6", hue: 280, chroma: 0.17 },
  { name: "Orange", hex: "#F39C12", hue: 40, chroma: 0.19 },
  { name: "Teal", hex: "#1ABC9C", hue: 180, chroma: 0.15 },
  { name: "Pink", hex: "#E91E63", hue: 340, chroma: 0.16 },
]

interface ThemeColors {
  primary: { hue: number; chroma: number; lightness: number }
  background: { lightness: number }
  foreground: { lightness: number }
  border: { lightness: number }
}

export function ThemeCustomizer({ open, onOpenChange }: ThemeCustomizerProps) {
  const [selectedPreset, setSelectedPreset] = useState(0)
  const [customHue, setCustomHue] = useState(230)
  const [customChroma, setCustomChroma] = useState(0.12)
  const [customLightness, setCustomLightness] = useState(0.72)

  const [bgLightness, setBgLightness] = useState(0.96)
  const [fgLightness, setFgLightness] = useState(0.09)
  const [borderLightness, setBorderLightness] = useState(0.13)

  const applyTheme = (hue: number, chroma: number, lightness: number, bg?: number, fg?: number, border?: number) => {
    const root = document.documentElement

    // Light mode colors
    const lightPrimary = `oklch(${lightness} ${chroma} ${hue})`
    const lightBg = `oklch(${bg ?? bgLightness} 0.002 106)`
    const lightFg = `oklch(${fg ?? fgLightness} 0.005 30)`
    const lightBorder = `oklch(${border ?? borderLightness} 0.005 30)`

    root.style.setProperty("--primary", lightPrimary)
    root.style.setProperty("--background", lightBg)
    root.style.setProperty("--foreground", lightFg)
    root.style.setProperty("--border", lightBorder)

    // Dark mode colors
    const darkPrimary = `oklch(${lightness} ${chroma} ${hue})`
    const darkBg = `oklch(0.09 0.005 30)`
    const darkFg = `oklch(0.96 0.002 106)`
    const darkBorder = `oklch(0.20 0.005 30)`

    // Update dark mode variables
    const style = document.createElement("style")
    style.id = "theme-customizer-dark"
    const existingStyle = document.getElementById("theme-customizer-dark")
    if (existingStyle) {
      existingStyle.remove()
    }
    style.textContent = `.dark { 
      --primary: ${darkPrimary}; 
      --background: ${darkBg};
      --foreground: ${darkFg};
      --border: ${darkBorder};
    }`
    document.head.appendChild(style)

    // Save to storage
    storage.saveTheme({
      primary: lightPrimary,
      background: lightBg,
      foreground: lightFg,
    })
  }

  const handlePresetClick = (index: number) => {
    setSelectedPreset(index)
    const preset = presetColors[index]
    setCustomHue(preset.hue)
    setCustomChroma(preset.chroma)
    applyTheme(preset.hue, preset.chroma, customLightness)
  }

  const handleCustomChange = () => {
    applyTheme(customHue, customChroma, customLightness, bgLightness, fgLightness, borderLightness)
  }

  useEffect(() => {
    const savedTheme = storage.getTheme()
    if (savedTheme?.primary) {
      // Parse saved theme if exists
      const match = savedTheme.primary.match(/oklch$$([\d.]+)\s+([\d.]+)\s+([\d.]+)$$/)
      if (match) {
        const lightness = Number.parseFloat(match[1])
        const chroma = Number.parseFloat(match[2])
        const hue = Number.parseFloat(match[3])
        setCustomLightness(lightness)
        setCustomChroma(chroma)
        setCustomHue(hue)
      }
    }
  }, [])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Theme</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Preset colors */}
          <div className="space-y-3">
            <Label>Preset Colors</Label>
            <div className="grid grid-cols-4 gap-3">
              {presetColors.map((preset, index) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetClick(index)}
                  className={`aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedPreset === index ? "border-foreground ring-2 ring-ring" : "border-border"
                  }`}
                  style={{
                    backgroundColor: preset.hex,
                  }}
                  title={preset.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <Label>Primary Accent Color</Label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Hue</span>
                <span className="text-sm font-mono">{customHue}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={customHue}
                onChange={(e) => setCustomHue(Number.parseInt(e.target.value))}
                onMouseUp={handleCustomChange}
                onTouchEnd={handleCustomChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, 
                    oklch(0.5 0.15 0),
                    oklch(0.5 0.15 60),
                    oklch(0.5 0.15 120),
                    oklch(0.5 0.15 180),
                    oklch(0.5 0.15 240),
                    oklch(0.5 0.15 300),
                    oklch(0.5 0.15 360)
                  )`,
                }}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Saturation</span>
                <span className="text-sm font-mono">{(customChroma * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.3"
                step="0.01"
                value={customChroma}
                onChange={(e) => setCustomChroma(Number.parseFloat(e.target.value))}
                onMouseUp={handleCustomChange}
                onTouchEnd={handleCustomChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-300 to-primary"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Brightness</span>
                <span className="text-sm font-mono">{(customLightness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="0.9"
                step="0.01"
                value={customLightness}
                onChange={(e) => setCustomLightness(Number.parseFloat(e.target.value))}
                onMouseUp={handleCustomChange}
                onTouchEnd={handleCustomChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black to-white"
              />
            </div>

            {/* Preview */}
            <div className="mt-4 p-4 rounded-lg border border-border bg-card">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-lg"
                  style={{
                    backgroundColor: `oklch(${customLightness} ${customChroma} ${customHue})`,
                  }}
                />
                <div>
                  <div className="text-sm font-medium">Primary Accent</div>
                  <div className="text-xs text-muted-foreground">Your custom color</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <Label>Background & Text Colors (Light Mode)</Label>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Background Brightness</span>
                <span className="text-sm font-mono">{(bgLightness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.85"
                max="1.0"
                step="0.01"
                value={bgLightness}
                onChange={(e) => setBgLightness(Number.parseFloat(e.target.value))}
                onMouseUp={handleCustomChange}
                onTouchEnd={handleCustomChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-gray-400 to-white"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Text Darkness</span>
                <span className="text-sm font-mono">{(fgLightness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.3"
                step="0.01"
                value={fgLightness}
                onChange={(e) => setFgLightness(Number.parseFloat(e.target.value))}
                onMouseUp={handleCustomChange}
                onTouchEnd={handleCustomChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black to-gray-500"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Border Darkness</span>
                <span className="text-sm font-mono">{(borderLightness * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.4"
                step="0.01"
                value={borderLightness}
                onChange={(e) => setBorderLightness(Number.parseFloat(e.target.value))}
                onMouseUp={handleCustomChange}
                onTouchEnd={handleCustomChange}
                className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-black to-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ThemeCustomizerButton() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Button variant="ghost" size="icon" onClick={() => setOpen(true)} title="Customize theme">
        <Palette className="h-5 w-5" />
      </Button>
      <ThemeCustomizer open={open} onOpenChange={setOpen} />
    </>
  )
}
