import * as React from "react";

import { useState } from "react";
import { Pencil } from "lucide-react";

export function SimpleInput({
  value,
  setValue,
  label,
}: {
  value: string;
  setValue: (value: string) => void;
  label: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState(value);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1">
        {!isEditing ? (
          <>
            <div className="flex items-center text-xs">
              {value ? value : label}
            </div>
            <button
              className="flex h-6 items-center gap-1 p-0 text-xs opacity-50 hover:opacity-100"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="h-3 w-3" />
            </button>
          </>
        ) : (
          <input
            type="text"
            placeholder={label}
            className="h-6 w-32 rounded-md bg-muted p-2 text-xs"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setValue(newValue);
                setIsEditing(false);
              } else if (e.key === "Escape") {
                setIsEditing(false);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
