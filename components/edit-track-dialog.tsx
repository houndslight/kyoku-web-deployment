"use client"

import { useState, useEffect } from "react"
import type { Track } from "@/lib/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface EditTrackDialogProps {
  track: Track | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (trackId: string, updates: Partial<Track>) => void
}

export function EditTrackDialog({ track, open, onOpenChange, onSave }: EditTrackDialogProps) {
  const [formData, setFormData] = useState({
    title: "",
    artist: "",
    album: "",
    year: "",
    genre: "",
    trackNumber: "",
  })

  useEffect(() => {
    if (track) {
      setFormData({
        title: track.title,
        artist: track.artist,
        album: track.album,
        year: track.year || "",
        genre: track.genre || "",
        trackNumber: track.trackNumber?.toString() || "",
      })
    }
  }, [track])

  const handleSave = () => {
    if (!track) return

    const updates: Partial<Track> = {
      title: formData.title,
      artist: formData.artist,
      album: formData.album,
      year: formData.year || undefined,
      genre: formData.genre || undefined,
      trackNumber: formData.trackNumber ? Number.parseInt(formData.trackNumber) : undefined,
    }

    onSave(track.id, updates)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Track Info</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="artist">Artist</Label>
            <Input
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="album">Album</Label>
            <Input
              id="album"
              value={formData.album}
              onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Input
                id="year"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                placeholder="2024"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="trackNumber">Track #</Label>
              <Input
                id="trackNumber"
                type="number"
                value={formData.trackNumber}
                onChange={(e) => setFormData({ ...formData, trackNumber: e.target.value })}
                placeholder="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Input
              id="genre"
              value={formData.genre}
              onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
              placeholder="Pop, Rock, Jazz..."
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
