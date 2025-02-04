"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";
import { Button } from "./button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function DraftFilter() {
  const { statusFilter, setStatusFilter } = useViewControl();

  function handlePress() {
    if (statusFilter === "hide-drafts") {
      setStatusFilter("hide-ready");
      return;
    }

    if (statusFilter === "hide-ready") {
      setStatusFilter("hide-none");
      return;
    }

    setStatusFilter("hide-drafts");
  }

  const hiding = statusFilter !== "hide-none";

  return (
    <Button variant="outline" onClick={handlePress}>
      {hiding ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
      {!hiding ? "All" : (statusFilter === "hide-drafts" ? "Drafts" : "Open PRs")}
    </Button>
  );
}
