"use client";
import { PlusIcon, X } from "lucide-react";
import * as React from "react";
import { useViewControl } from "../../contexts/view-control.context";
import { Switch } from "./switch";

export function UserFilter() {
  const { selectedUsers, toggleUser, setFilterByUser, filterByUser } = useViewControl();

  return (
    <div className="flex gap-0.5 text-xs justify-center items-center">
      <Switch checked={filterByUser} onCheckedChange={setFilterByUser} />
      <div className="flex flex-wrap gap-0.5 text-xs justify-start items-center max-w-60">
        {selectedUsers.map((user) => (
          <div
            key={user}
            className="flex flex-row items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer bg-secondary hover:bg-secondary/90"
            onClick={() => toggleUser(user)}
          >
            {user}
            <X className="w-3 h-3 text-muted-foreground hover:text-primary" />
          </div>
        ))}
        <AddUserButton />
      </div>
    </div>
  );
}

function AddUserButton() {
  const ref = React.useRef<HTMLInputElement>(null);

  const [addingUser, setAddingUser] = React.useState(false);
  const [newUser, setNewUser] = React.useState("");
  const { selectedUsers, toggleUser, setFilterByUser, filterByUser } = useViewControl();

  const addUser = () => {
    if (newUser && !selectedUsers.includes(newUser) && newUser !== "") {
      toggleUser(newUser);
      setNewUser("");
    }
  };

  React.useEffect(() => {
    if (addingUser) {
      ref.current?.focus();
    }
  }, [addingUser]);

  if (addingUser) {
  return (
    <input
      ref={ref}
      value={newUser}
      type="text"
      onBlur={() => setAddingUser(false)}
      placeholder="Add user"
      className="text-xs px-2 py-0.5 rounded-full bg-muted max-w-24 outline-none"
      onChange={(e) => setNewUser(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addUser();
        }
      }}
    />
    );
  }

  return (
    <button
      className="text-muted-foreground hover:text-primary w-5 h-5 rounded-full flex items-center justify-center bg-muted"
      onClick={() => setAddingUser(true)}
    >
      <PlusIcon className="size-4" />
    </button>
  );
}
