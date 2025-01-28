import * as React from "react"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { Input } from "./input"
import { Button } from "./button"
import { Badge } from "./badge"
import { Textarea } from "./textarea"

export function InlineBadgeListManager({ badges, setBadges }: { badges: string[], setBadges: (badges: string[]) => void }) {
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

  return (
    <div className="flex flex-wrap items-center gap-2">
      {badges.map((badge, index) => (
        <Badge key={index} variant="secondary" className="text-xs cursor-pointer">
          {badge}
          <Button variant="ghost" size="sm" className="ml-1 h-4 w-4 p-0 opacity-50 hover:opacity-100" onClick={() => removeBadge(index)}>
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
      {isAdding ? (
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="New badge"
            value={newBadgeText}
            onChange={(e) => setNewBadgeText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                addBadge()
              }
            }}
            className="h-8 w-32 text-sm"
          />
          <Button size='sm' variant="ghost" onClick={addBadge} className="h-8 px-2">
            Add
          </Button>
        </div>
      ) : (

        <Badge variant="secondary" className="text-xs cursor-pointer" >
          <Button variant="ghost" size="sm" className="h-4 w-4 p-0 opacity-50 hover:opacity-100" onClick={() => setIsAdding(true)}>
            <Plus className="h-3 w-3" />
          </Button>
        </Badge>
      )}
    </div>
  )
}

export function BadgeManager({ badges, setBadges }: { badges: {[key: string]: string}, setBadges: (badges: {[key: string]: string}) => void }) {
  const [error, setError] = useState<string | null>(null)
  
  const [json, setJson] = useState(JSON.stringify(badges, null, 2))

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJson(e.target.value)
  }

  const handleUpdate = () => {
    try {
      const parsed = validateBadgeJson(json)
      setBadges(parsed)
    } catch (e) {
      setError("Invalid JSON")
    }
  }

  return (
    <div>
      <Textarea value={json} onChange={handleChange} />
      {error && <p className="text-red-500">{error}</p>}
      <Button onClick={handleUpdate}>Update</Button>
    </div>
  )
}

function validateBadgeJson(json: string) {
  try {
    const parsed: {[key: string]: string} = JSON.parse(json)
    if (typeof parsed !== "object" || parsed === null) {
      throw new Error("Invalid JSON")
    }
    for (const key in parsed) {
      if (typeof parsed[key] !== "string") {
        throw new Error("Invalid JSON")
      }
    }
    return parsed;
  } catch (e) {
    throw new Error("Invalid JSON")
  }
}