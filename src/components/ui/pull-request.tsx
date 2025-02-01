"use client";
import * as React from "react";
import { useViewControl } from "~/contexts/view-control.context";
import { PullRequest } from "~/server/api/routers/pull-requests";
import { SelectableUser } from "./selectable-user";

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
  const { checkUserIsSelected, filterByUser } = useViewControl();

  const waiting = waitingLabel(pr.createdAt);
  const changes = `${pr.changes.files}F +${pr.changes.additions} -${pr.changes.deletions}`;

  const userSelected = checkUserIsSelected(pr.user);
  const userReviewed = pr.reviews.some((r) => checkUserIsSelected(r.user));

  const isUserRelated = userSelected || userReviewed;

  if (filterByUser && !isUserRelated) return null;

  return (
    <div
      key={pr.id}
      className={`flex w-full flex-col items-start border bg-card text-xs text-muted-foreground shadow-sm`}
    >
      <div
        className={`flex w-full flex-row items-center justify-between border-b bg-muted px-2 py-0.5`}
      >
        <SelectableUser user={pr.user} />
        <div className="cursor-pointer">{waiting}</div>
      </div>
      <div className={`flex w-full flex-col gap-2 p-2`}>
        <a
          href={pr.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary-foreground hover:underline"
        >
          {pr.draft ? "DRAFT " : ""}
          {pr.title}
        </a>
        <div>{changes}</div>
        <div className="flex flex-col gap-1">
          {pr.reviews.map((r) => (
            <div
              key={r.user}
              className="flex flex-row items-center gap-1 rounded-md text-xs"
            >
              <div
                className={`h-2 w-2 rounded-full ${colorFromState(r.state)}`}
              />
              <SelectableUser user={r.user} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}