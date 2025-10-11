"use client"

import { Music, Heart, Clock, ListMusic } from "lucide-react"
import { Button } from "@/components/ui/button"

interface BottomNavProps {
  activeView: "library" | "favorites" | "recent" | "playlists"
  onViewChange: (view: "library" | "favorites" | "recent" | "playlists") => void
}

export function BottomNav({ activeView, onViewChange }: BottomNavProps) {
  const navItems = [
    { id: "library" as const, label: "Library", icon: Music },
    { id: "favorites" as const, label: "Favorites", icon: Heart },
    { id: "recent" as const, label: "Recent", icon: Clock },
    { id: "playlists" as const, label: "Playlists", icon: ListMusic },
  ]

  return (
    <div className="md:hidden border-t border-border bg-card">
      <nav className="flex items-center justify-around px-2 py-2 safe-area-inset-bottom">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activeView === item.id

          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`flex-1 flex flex-col items-center gap-1 h-auto py-2 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              onClick={() => onViewChange(item.id)}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Button>
          )
        })}
      </nav>
    </div>
  )
}
