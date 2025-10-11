export interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  filePath: string
  coverArt?: string
  year?: string
  genre?: string
  trackNumber?: number
  addedAt: number
}

export interface Playlist {
  id: string
  name: string
  tracks: string[] // Track IDs
  createdAt: number
  updatedAt: number
}

export interface PlaybackState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  volume: number
  repeat: "none" | "one" | "all"
  shuffle: boolean
}

export interface LibraryState {
  tracks: Track[]
  playlists: Playlist[]
  recentlyPlayed: string[] // Track IDs
  favorites: string[] // Track IDs
}

export interface ThemeColors {
  primary: string
  background: string
  foreground: string
}
