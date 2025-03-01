"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";
import { Button } from "./button";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

export function StatusFilter() {
  const { hideMerged, setHideMerged, hideDrafts, setHideDrafts } = useViewControl();

  return (
    <div className="flex gap-0.5 text-xs justify-center items-center">
      <Button variant={hideMerged ? 'secondary' : "ghost"} size="sm" onClick={() => setHideMerged(!hideMerged)}>
        {hideMerged ? <EyeClosedIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        Merged
      </Button>
      <Button variant={hideDrafts ? 'secondary' : "ghost"} size="sm" onClick={() => setHideDrafts(!hideDrafts)}>
        {hideDrafts ? <EyeClosedIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        Drafts
      </Button>
    </div>
  );
}
