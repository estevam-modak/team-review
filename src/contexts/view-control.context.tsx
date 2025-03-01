import * as React from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";

export type User = {
  name: string;
  desired: boolean;
}

export type UserFilter = "show-all" | "show-only-desired" | "hide-only-undesired"

interface ViewControlContextType {
  hideDrafts: boolean;
  setHideDrafts: (hideDrafts: boolean) => void;

  hideMerged: boolean;
  setHideMerged: (hideMerged: boolean) => void;

  userFilter: UserFilter;
  setUserFilter: (userFilter: UserFilter) => void;

  users: User[];
  setUsers: (users: User[]) => void;

  addDesiredUser: (userName: string) => void;
  addUndesiredUser: (userName: string) => void;
  removeUser: (userName: string) => void;
  toggleUserDesired: (userName: string) => void;
  toggleUserState: (userName: string) => void;
}

const ViewControlContext = React.createContext<ViewControlContextType | undefined>(
  undefined,
);

export function ViewControlProvider({ children }: { children: React.ReactNode }) {
  const [hideDrafts, setHideDrafts] = useLocalStorage<boolean>(
    "hideDrafts",
    false,
  );
  const [hideMerged, setHideMerged] = useLocalStorage<boolean>(
    "hideMerged",
    false,
  );
  const [userFilter, setUserFilter] = useLocalStorage<UserFilter>(
    "userFilter",
    "show-all",
  );
  const [users, setUsers] = useLocalStorage<User[]>(
    "users",
    [],
  );

  const addDesiredUser = (userName: string) => {
    setUsers([...users, { name: userName, desired: true }]);
  };

  const addUndesiredUser = (userName: string) => {
    setUsers([...users, { name: userName, desired: false }]);
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
      addDesiredUser(userName);
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
        hideDrafts,
        setHideDrafts,

        hideMerged,
        setHideMerged,

        userFilter,
        setUserFilter,
        
        users,
        setUsers,
        
        addDesiredUser,
        addUndesiredUser,
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
