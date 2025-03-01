"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";
import { PullRequest } from "~/server/api/routers/pull-requests";
import { SelectableUser } from "./selectable-user";
import "./pull-request.css";

function colorFromState(state: string) {
  if (state === "APPROVED") return "bg-green-500";
  if (state === "CHANGES_REQUESTED") return "bg-red-500";
  return "bg-yellow-500";
}

function waitingLabel(date: string) {
  const initialDate = new Date(date);
  const finalDate = new Date();
  const timeBetween = finalDate.getTime() - initialDate.getTime();
  const days = Math.floor(timeBetween / 1000 / 60 / 60 / 24);
  const hours = Math.floor(timeBetween / 1000 / 60 / 60) % 24;
  const minutes = Math.floor(timeBetween / 1000 / 60) % 60;
  const waiting =
    days > 0
      ? `${days}d`
      : hours > 0
        ? `${hours}h`
        : minutes > 0
          ? `${minutes}m`
          : "now";

  return waiting;
}

export function PRCard({ pr }: { pr: PullRequest }) {
  const { hideMerged, hideDrafts, users, userFilter } = useViewControl();

  const waiting = waitingLabel(pr.createdAt);
  const changes = `${pr.changes.files}f +${pr.changes.additions} -${pr.changes.deletions}`;

  let hasDesiredUser = false;
  let hasUndesiredUser = false;

  users.forEach((u) => {
    if (u.name === pr.user) {
      u.desired ? hasDesiredUser = true : hasUndesiredUser = true;
    }
    if (pr.reviews.some((r) => r.user === u.name)) {
      u.desired ? hasDesiredUser = true : hasUndesiredUser = true;
    }
  })

  if (hideDrafts && pr.draft) return null;
  if (hideMerged && pr.state === "MERGED") return null;
  if (userFilter === "hide-only-undesired" && hasUndesiredUser) return null;
  if (userFilter === "show-only-desired" && !hasDesiredUser) return null;

  return ( 
    <div className={`flex w-full flex-col gap-2 p-2 bg-card text-xs text-muted-foreground border-b-2 rounded-sm border-foreground/10 card`}>
      <h3>
        {pr.draft && <a className="text-xs font-semibold text-destructive mr-1">DRAFT</a>}
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-foreground hover:underline"
        >
          {pr.title}
        </a>
      </h3>
      <div className="flex flex-col gap-1 relative">
        <div className="flex flex-row items-center gap-1">
          <SelectableUser user={pr.user} />
        </div>
        {pr.reviews.map((r) => (
          <div
            key={r.user}
            className="flex flex-row items-center gap-1"
          >
            <div
              className={`h-2 w-2 rounded-full ${colorFromState(r.state)}`}
            />
            <SelectableUser user={r.user} />
          </div>
        ))}
        <div className="absolute bottom-0 right-0 flex flex-row items-center gap-1">
          <div className="changes">{changes}</div>
          <div>{waiting}</div>
        </div>
      </div>
    </div>
  );
}