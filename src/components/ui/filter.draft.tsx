"use client";
import * as React from "react";
import { useViewControl, StatusFilter as StatusFilterType } from "~/contexts/view-control.context";
import { ToggleGroup, ToggleGroupItem } from "./toggle.group";
import { Button } from "./button";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

export function DraftFilter() {
  const { statusFilter, setStatusFilter } = useViewControl();

  function handlePress(value: string) {
    if (value === statusFilter) {
      setStatusFilter("hide-none");
      return;
    }
    setStatusFilter(value as StatusFilterType);
  }

  const hideDrafts = statusFilter === "hide-drafts"
  const hideReady = statusFilter === "hide-ready"

  return (
    <div className="flex gap-0.5 text-xs justify-center items-center">
      <Button variant={hideDrafts ? 'secondary' : "ghost"} size="sm" onClick={() => handlePress("hide-drafts")}>
        {hideDrafts ? <EyeClosedIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        Drafts
      </Button>
      <Button variant={hideReady ? 'secondary' : "ghost"} size="sm" onClick={() => handlePress("hide-ready")}>
        {hideReady ? <EyeClosedIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
        Open PRs
      </Button>
    </div>
  );
}
