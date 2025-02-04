"use client";
import { FilterIcon, Italic, PlusIcon, Underline, X } from "lucide-react";
import * as React from "react";
import { useViewControl, User as UserType, UserFilter as UserFilterType } from "../../contexts/view-control.context";
import { Button } from "./button";
import { ToggleGroup, ToggleGroupItem } from "./toggle.group";

export function UserFilter() {
  const { users, setUserFilter, userFilter } = useViewControl();

  const handleButtonClick = (value: string) => {
    console.log(value);
    if (value === userFilter) {
      setUserFilter("show-all");
    } else {
      setUserFilter(value as UserFilterType);
    }
  };

  return (
    <div className="flex gap-0.5 text-xs justify-center items-center">
      <ToggleGroup variant="outline" type="single" size="sm" value={userFilter} onValueChange={handleButtonClick}>
        <ToggleGroupItem value="show-only-desired" aria-label="Show only desired">
          Show
        </ToggleGroupItem>
        <ToggleGroupItem value="hide-only-undesired" aria-label="Hide only undesired">
          Hide
        </ToggleGroupItem>
      </ToggleGroup>      
      <div className="flex flex-wrap gap-0.5 text-xs justify-start items-center max-w-80">
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
  const { addUser } = useViewControl();

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
