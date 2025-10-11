"use client"

import { useState, useEffect, useCallback } from "react"
import type { Track, LibraryState } from "@/lib/types"
import { storage } from "@/lib/storage"
import { parseAudioFile } from "@/lib/id3-parser"

export function useMusicLibrary() {
  const [library, setLibrary] = useState<LibraryState>({
    tracks: [],
    playlists: [],
    recentlyPlayed: [],
    favorites: [],
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedLibrary = storage.getLibrary()
    setLibrary(savedLibrary)
  }, [])

  const importFiles = useCallback(async (files: FileList) => {
    setIsLoading(true)
    const newTracks: Track[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]

      if (!file.type.startsWith("audio/")) continue

      try {
        const metadata = await parseAudioFile(file)
        const track: Track = {
          id: `track-${Date.now()}-${i}`,
          title: metadata.title || file.name,
          artist: metadata.artist || "Unknown Artist",
          album: metadata.album || "Unknown Album",
          duration: metadata.duration || 0,
          filePath: metadata.filePath!,
          coverArt: metadata.coverArt,
          year: metadata.year,
          genre: metadata.genre,
          trackNumber: metadata.trackNumber,
          addedAt: Date.now(),
        }

        newTracks.push(track)
        storage.addTrack(track)
      } catch (error) {
        console.error("[v0] Error importing file:", file.name, error)
      }
    }

    const updatedLibrary = storage.getLibrary()
    setLibrary(updatedLibrary)
    setIsLoading(false)

    return newTracks
  }, [])

  const removeTrack = useCallback((trackId: string) => {
    storage.removeTrack(trackId)
    setLibrary(storage.getLibrary())
  }, [])

  const updateTrack = useCallback((trackId: string, updates: Partial<Track>) => {
    storage.updateTrack(trackId, updates)
    setLibrary(storage.getLibrary())
  }, [])

  const toggleFavorite = useCallback((trackId: string) => {
    storage.toggleFavorite(trackId)
    setLibrary(storage.getLibrary())
  }, [])

  const createPlaylist = useCallback((name: string) => {
    const playlist = storage.createPlaylist(name)
    setLibrary(storage.getLibrary())
    return playlist
  }, [])

  const deletePlaylist = useCallback((playlistId: string) => {
    storage.deletePlaylist(playlistId)
    setLibrary(storage.getLibrary())
  }, [])

  const addToPlaylist = useCallback((playlistId: string, trackId: string) => {
    storage.addToPlaylist(playlistId, trackId)
    setLibrary(storage.getLibrary())
  }, [])

  return {
    library,
    isLoading,
    importFiles,
    removeTrack,
    updateTrack,
    toggleFavorite,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
  }
}
