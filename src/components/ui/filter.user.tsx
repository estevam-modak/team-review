"use client";
import { FilterIcon, PlusIcon, X } from "lucide-react";
import * as React from "react";
import { useViewControl, User as UserType } from "../../contexts/view-control.context";
import { Button } from "./button";

export function UserFilter() {
  const { users, setUserFilter, userFilter } = useViewControl();

  const handleButtonClick = () => {
    switch (userFilter) {
      case "show-all":
        setUserFilter("hide-only-undesired");
        break;
      case "hide-only-undesired":
        setUserFilter("show-only-desired");
        break;
      case "show-only-desired":
        setUserFilter("show-all");
        break;
    }
  };

  return (
    <div className="flex gap-0.5 text-xs justify-center items-center">
      <Button variant="outline" onClick={handleButtonClick}>
        <FilterIcon className={`size-4 ${userFilter === "show-all" ? "" : (
          userFilter === "show-only-desired" ? "text-primary" : "text-destructive"
        )}`} />
      </Button>
      <div className="flex flex-wrap gap-0.5 text-xs justify-start items-center max-w-60">
        {users.map((user) => (
          <User key={user.name} user={user} />
        ))}
        <AddUserButton />
      </div>
    </div>
  );
}

function User({ user }: { user: UserType }) {
  const { toggleUserDesired, toggleUserState } = useViewControl();

  return (
    <div
      className={`flex flex-row items-center gap-1 px-2 py-0.5 rounded-full cursor-pointer  
        ${user.desired ? 
          "bg-primary/20 text-primary hover:bg-primary/30" : 
          "bg-destructive/20 text-destructive hover:bg-destructive/30"}
      `}
    >
      <div onClick={() => toggleUserDesired(user.name)}>{user.name}</div>
      <X className={`w-3 h-3 ${user.desired ? "text-primary" : "text-destructive"}`} onClick={() => toggleUserState(user.name)}/>
    </div>
  );
}

function AddUserButton() {
  const ref = React.useRef<HTMLInputElement>(null);

  const [addingUser, setAddingUser] = React.useState(false);
  const [newUser, setNewUser] = React.useState("");
  const { users, addUser } = useViewControl();

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
      className="text-xs px-2 py-0.5 rounded-full bg-muted-foreground/20 max-w-24 outline-none text-muted-foreground"
      onChange={(e) => setNewUser(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          addUser(newUser);
          setAddingUser(false);
          setNewUser("");
        }
      }}
    />
    );
  }

  return (
    <button
      className="text-muted-foreground w-5 h-5 rounded-full flex items-center justify-center bg-muted-foreground/20 hover:bg-muted-foreground/30"
      onClick={() => setAddingUser(true)}
    >
      <PlusIcon className="size-4" />
    </button>
  );
}
