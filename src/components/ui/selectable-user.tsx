"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";

export function SelectableUser({ user }: { user: string }) {
  const { toggleUserState, users } = useViewControl();

  const selected = users.find((u) => u.name === user)?.desired;

  const click = () => {
    toggleUserState(user);
  };

  return (
    <div
      className={`cursor-pointer hover:font-semibold ${selected === undefined ? "" : selected ? "text-primary" : "text-destructive"}`}
      onClick={click}
    >
      {user}
    </div>
  );
}
