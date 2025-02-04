"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";
import { Button } from "./button";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function DraftFilter() {
  const { hideDrafts, setHideDrafts } = useViewControl();

  return (
    <Button variant="ghost" onClick={() => setHideDrafts(!hideDrafts)}>
      {hideDrafts ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
      Drafts
    </Button>
  );
}
