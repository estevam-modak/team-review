"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";
import { Switch } from "~/components/ui/switch";

export function DraftFilter() {
  const { hideDrafts, setHideDrafts } = useViewControl();

  return (
    <div className="flex gap-2 text-xs justify-center items-center">
      <Switch checked={hideDrafts} onCheckedChange={setHideDrafts} />
      <div className="flex flex-row gap-1">
        <label>
          Hide drafts
        </label>
      </div>
    </div>
  );
}
