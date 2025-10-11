"use client"

import { Music, Heart, Clock, ListMusic } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  activeView: "library" | "favorites" | "recent" | "playlists"
  onViewChange: (view: "library" | "favorites" | "recent" | "playlists") => void
  trackCount: number
  favoriteCount: number
}

export function Sidebar({ activeView, onViewChange, trackCount, favoriteCount }: SidebarProps) {
  const navItems = [
    { id: "library" as const, label: "Library", icon: Music, count: trackCount },
    { id: "favorites" as const, label: "Favorites", icon: Heart, count: favoriteCount },
    { id: "recent" as const, label: "Recently Played", icon: Clock },
    { id: "playlists" as const, label: "Playlists", icon: ListMusic },
  ]

  return (
    <div className="w-64 border-r border-border bg-card flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-medium text-foreground tracking-tight">Kyoku 曲</h1>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <Button
              key={item.id}
              variant={isActive ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-4 w-4 mr-3" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.count !== undefined && <span className="text-xs text-muted-foreground">{item.count}</span>}
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
