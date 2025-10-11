"use client"

import type { Track, Playlist, LibraryState, ThemeColors } from "./types"

const STORAGE_KEYS = {
  LIBRARY: "music-player-library",
  PLAYBACK: "music-player-playback",
  THEME: "music-player-theme",
  SETTINGS: "music-player-settings",
}

export const storage = {
  // Library operations
  getLibrary(): LibraryState {
    if (typeof window === "undefined") {
      return { tracks: [], playlists: [], recentlyPlayed: [], favorites: [] }
    }

    const data = localStorage.getItem(STORAGE_KEYS.LIBRARY)
    if (!data) {
      return { tracks: [], playlists: [], recentlyPlayed: [], favorites: [] }
    }

    try {
      return JSON.parse(data)
    } catch {
      return { tracks: [], playlists: [], recentlyPlayed: [], favorites: [] }
    }
  },

  saveLibrary(library: LibraryState) {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library))
  },

  addTrack(track: Track) {
    const library = this.getLibrary()
    library.tracks.push(track)
    this.saveLibrary(library)
  },

  removeTrack(trackId: string) {
    const library = this.getLibrary()
    library.tracks = library.tracks.filter((t) => t.id !== trackId)
    library.recentlyPlayed = library.recentlyPlayed.filter((id) => id !== trackId)
    library.favorites = library.favorites.filter((id) => id !== trackId)
    this.saveLibrary(library)
  },

  updateTrack(trackId: string, updates: Partial<Track>) {
    const library = this.getLibrary()
    const trackIndex = library.tracks.findIndex((t) => t.id === trackId)
    if (trackIndex !== -1) {
      library.tracks[trackIndex] = { ...library.tracks[trackIndex], ...updates }
      this.saveLibrary(library)
    }
  },

  // Recently played
  addToRecentlyPlayed(trackId: string) {
    const library = this.getLibrary()
    library.recentlyPlayed = [trackId, ...library.recentlyPlayed.filter((id) => id !== trackId)].slice(0, 50) // Keep last 50
    this.saveLibrary(library)
  },

  // Favorites
  toggleFavorite(trackId: string) {
    const library = this.getLibrary()
    const index = library.favorites.indexOf(trackId)
    if (index === -1) {
      library.favorites.push(trackId)
    } else {
      library.favorites.splice(index, 1)
    }
    this.saveLibrary(library)
  },

  isFavorite(trackId: string): boolean {
    const library = this.getLibrary()
    return library.favorites.includes(trackId)
  },

  // Playlists
  createPlaylist(name: string): Playlist {
    const library = this.getLibrary()
    const playlist: Playlist = {
      id: `playlist-${Date.now()}`,
      name,
      tracks: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    library.playlists.push(playlist)
    this.saveLibrary(library)
    return playlist
  },

  deletePlaylist(playlistId: string) {
    const library = this.getLibrary()
    library.playlists = library.playlists.filter((p) => p.id !== playlistId)
    this.saveLibrary(library)
  },

  addToPlaylist(playlistId: string, trackId: string) {
    const library = this.getLibrary()
    const playlist = library.playlists.find((p) => p.id === playlistId)
    if (playlist && !playlist.tracks.includes(trackId)) {
      playlist.tracks.push(trackId)
      playlist.updatedAt = Date.now()
      this.saveLibrary(library)
    }
  },

  removeFromPlaylist(playlistId: string, trackId: string) {
    const library = this.getLibrary()
    const playlist = library.playlists.find((p) => p.id === playlistId)
    if (playlist) {
      playlist.tracks = playlist.tracks.filter((id) => id !== trackId)
      playlist.updatedAt = Date.now()
      this.saveLibrary(library)
    }
  },

  // Theme
  getTheme(): ThemeColors | null {
    if (typeof window === "undefined") return null
    const data = localStorage.getItem(STORAGE_KEYS.THEME)
    return data ? JSON.parse(data) : null
  },

  saveTheme(theme: ThemeColors) {
    if (typeof window === "undefined") return
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme))
  },

  // Settings
  getSettings() {
    if (typeof window === "undefined") return {}
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS)
    return data ? JSON.parse(data) : {}
  },

  saveSetting(key: string, value: any) {
    const settings = this.getSettings()
    settings[key] = value
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  },
}
