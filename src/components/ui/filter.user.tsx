"use client";
import { X } from "lucide-react";
import * as React from "react";
import { useViewControl } from "../../contexts/view-control.context";
import { Switch } from "./switch";

export function UserFilter() {
  const [newUser, setNewUser] = React.useState("");
  const { selectedUsers, toggleUser, setFilterByUser, filterByUser } = useViewControl();

  const addUser = () => {
    if (newUser && !selectedUsers.includes(newUser) && newUser !== "") {
      toggleUser(newUser);
      setNewUser("");
    }
  };

  return (
    <div className="flex gap-0.5 text-xs justify-center items-center">
      <Switch checked={filterByUser} onCheckedChange={setFilterByUser} />
      <input
        value={newUser}
        type="text"
        placeholder="Select user"
        className="text-xs px-2 py-0.5 rounded-full bg-background hover:bg-secondary/50 max-w-24"
        onChange={(e) => setNewUser(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            addUser();
          }
        }}
      />
      <div className="flex flex-wrap gap-0.5 text-xs justify-start items-center max-w-60">
      {selectedUsers.map((user) => (
          <div
            key={user}
            className="flex flex-row items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer bg-secondary hover:bg-secondary/90"
            onClick={() => toggleUser(user)}
          >
            {user}
            <X className="w-3 h-3" />
          </div>
        ))}
      </div>
    </div>
  );
}
