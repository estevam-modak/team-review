"use client";
import { X } from "lucide-react";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";
import { Switch } from "~/components/ui/switch";

export function DraftFilter() {
  const { hideDrafts, setHideDrafts } = useViewControl();

  return (
    <div className="flex gap-2 text-xs justify-center items-center">
      <Switch checked={hideDrafts} onCheckedChange={setHideDrafts} />
      <div className="flex flex-row gap-1">
        <div className="flex flex-row items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer bg-secondary hover:bg-secondary/90">
          Draft
        </div>
      </div>
    </div>
  );
}
