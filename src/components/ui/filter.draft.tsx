"use client";
import * as React from "react";
import { useViewControl, StatusFilter as StatusFilterType } from "~/contexts/view-control.context";
import { ToggleGroup, ToggleGroupItem } from "./toggle.group";

export function DraftFilter() {
  const { statusFilter, setStatusFilter } = useViewControl();

  function handlePress(value: string) {
    if (value === statusFilter) {
      setStatusFilter("hide-none");
      return;
    }
    setStatusFilter(value as StatusFilterType);
  }

  return (
    <ToggleGroup variant="outline"  type="single" size="sm" value={statusFilter} onValueChange={handlePress}>
        <ToggleGroupItem value="hide-drafts" aria-label="Show only desired">
          Drafts
        </ToggleGroupItem>
        <ToggleGroupItem value="hide-ready" aria-label="Hide only undesired">
          Open PRs
      </ToggleGroupItem>
    </ToggleGroup> 
  );
}
