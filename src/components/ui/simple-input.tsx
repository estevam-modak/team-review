import * as React from "react"

import { useState } from "react"
import { Pencil } from "lucide-react"

export function SimpleInput({ value, setValue, label }: { value: string, setValue: (value: string) => void, label: string, }) {
  const [isEditing, setIsEditing] = useState(false)
  const [newValue, setNewValue] = useState(value)


  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
      {!isEditing ? (
        <>
          <div className="flex items-center text-xs">
            {value ? value : label}
          </div>
          <button className="h-6 p-0 flex items-center gap-1 text-xs opacity-50 hover:opacity-100" onClick={() => setIsEditing(true)}>
            <Pencil className="h-3 w-3" />
          </button>
        </>
      ) : (
          <input
            type="text"
            placeholder={label}
            className="h-6 p-2 bg-muted w-32 text-xs rounded-md"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setValue(newValue)
                setIsEditing(false)
              } else if (e.key === "Escape") {
                setIsEditing(false)
              }
            }}
        />
      )}
      </div>
    </div>
  )
}
