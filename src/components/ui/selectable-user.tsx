"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";

export function SelectableUser({ user }: { user: string }) {
  const { toggleUser, checkUserIsSelected } = useViewControl();

  const selected = checkUserIsSelected(user);

  const click = () => {
    toggleUser(user);
  };

  return (
    <div
      className={`cursor-pointer hover:text-primary ${selected ? "font-semibold text-primary" : ""}`}
      onClick={click}
    >
      {user}
    </div>
  );
}
