import * as React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"

const COLORS = ["bg-red-100", "bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-purple-100", "bg-pink-100", "bg-orange-100", "bg-gray-100"]

export function InlineBadgeListManager({ badges, setBadges, colors, setColor }: { badges: string[], setBadges: (badges: string[]) => void, colors: { [key: string]: string }, setColor: (badge: string, color: string) => void }) {
  const [isAdding, setIsAdding] = useState(false)
  const [newBadgeText, setNewBadgeText] = useState("")

  const addBadge = () => {
    if (newBadgeText.trim() !== "") {
      setBadges([...badges, newBadgeText.trim()])
      setNewBadgeText("")
    }
    setIsAdding(false)
  }

  const removeBadge = (index: number) => {
    setBadges(badges.filter((_, i) => i !== index))
  }

  const nextColor = (badge: string) => {
    const color = colors[badge] || "bg-muted"
    const index = COLORS.indexOf(color)
    const next = COLORS[(index + 1) % COLORS.length] || "bg-muted" 
    setColor(badge, next)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge, index) => (
        <div key={index} className={`text-xs cursor-pointer flex items-center gap-1 h-6 px-2 py-1 rounded-md ${colors[badge] ?? "bg-muted"}`} onClick={() => nextColor(badge)}>
          {badge}
          <button className="p-0 opacity-50 hover:opacity-100" onClick={() => removeBadge(index)}>
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
      {!isAdding ? (
        <button className="h-6 p-0 opacity-50 hover:opacity-100 flex items-center gap-1 text-xs" onClick={() => setIsAdding(true)}>
          <Plus className="h-3 w-3" /> Repo
        </button>
      ) : (
        <div className="flex items-center">
          <input
            type="text"
            placeholder="New badge"
            className="h-6 p-2 bg-muted w-32 text-xs rounded-md"
            value={newBadgeText}
            onChange={(e) => setNewBadgeText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addBadge()
              } else if (e.key === "Escape") {
                setIsAdding(false)
              }
            }}
        />
       </div>
      )}
    </div>
  )
}
