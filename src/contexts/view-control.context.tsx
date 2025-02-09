import * as React from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";

export type User = {
  name: string;
  desired: boolean;
}

export type StatusFilter = "hide-none" | "hide-drafts" | "hide-ready"
export type UserFilter = "show-all" | "show-only-desired" | "hide-only-undesired"

interface ViewControlContextType {
  statusFilter: StatusFilter;
  setStatusFilter: (statusFilter: StatusFilter) => void;

  userFilter: UserFilter;
  setUserFilter: (userFilter: UserFilter) => void;

  users: User[];
  setUsers: (users: User[]) => void;

  addUser: (userName: string) => void;
  removeUser: (userName: string) => void;
  toggleUserDesired: (userName: string) => void;
  toggleUserState: (userName: string) => void;
}

const ViewControlContext = React.createContext<ViewControlContextType | undefined>(
  undefined,
);

export function ViewControlProvider({ children }: { children: React.ReactNode }) {
  const [statusFilter, setStatusFilter] = useLocalStorage<StatusFilter>(
    "statusFilter",
    "hide-none",
  );
  const [userFilter, setUserFilter] = useLocalStorage<UserFilter>(
    "userFilter",
    "show-all",
  );
  const [users, setUsers] = useLocalStorage<User[]>(
    "users",
    [],
  );

  const addUser = (userName: string) => {
    setUsers([...users, { name: userName, desired: true }]);
  };

  const removeUser = (userName: string) => {
    setUsers(users.filter((u) => u.name !== userName));
  };

  const toggleUserDesired = (userName: string) => {
    setUsers(users.map((u) => u.name === userName ? { ...u, desired: !u.desired } : u));
  };

  const toggleUserState = (userName: string) => {
    const user = users.find((u) => u.name === userName);

    if (!user) {
      addUser(userName);
      return;
    }

    if (user.desired) {
      toggleUserDesired(userName);
      return;
    }

    removeUser(userName);
  };

  return (
    <ViewControlContext.Provider
      value={{
        statusFilter,
        setStatusFilter,

        userFilter,
        setUserFilter,
        
        users,
        setUsers,
        
        addUser,
        removeUser,
        toggleUserDesired,
        toggleUserState,
      }}
    >
      {children}
    </ViewControlContext.Provider>
  );
}

export function useViewControl() {
  const context = React.useContext(ViewControlContext);
  if (context === undefined) {
    throw new Error("useViewControl must be used within a ViewControlProvider");
  }
  return context;
}
