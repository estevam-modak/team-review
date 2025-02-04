import * as React from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";

interface ViewControlContextType {
  toggleUser: (user: string) => void;
  checkUserIsSelected: (user: string) => boolean;
  selectedUsers: string[];
  hasSelectedUsers: boolean;

  hideReady: boolean;
  setHideReady: (hideReady: boolean) => void;

  hideDrafts: boolean;
  setHideDrafts: (hideDrafts: boolean) => void;
  
  filterByUser: boolean;
  setFilterByUser: (filterByUser: boolean) => void;
}

const ViewControlContext = React.createContext<ViewControlContextType | undefined>(
  undefined,
);

export function ViewControlProvider({ children }: { children: React.ReactNode }) {
  const [selectedUsers, setSelectedUsers] = useLocalStorage<string[]>(
    "selectedUsers",
    [],
  );
  const [hideDrafts, setHideDrafts] = useLocalStorage<boolean>(
    "hideDrafts",
    false,
  );
  const [hideReady, setHideReady] = useLocalStorage<boolean>(
    "hideReady",
    false,
  );
  const [filterByUser, setFilterByUser] = useLocalStorage<boolean>(
    "filterByUser",
    false,
  );

  const toggleUser = (user: string) => {
    if (selectedUsers.includes(user)) {
      setSelectedUsers(selectedUsers.filter((u) => u !== user));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const checkUserIsSelected = (user: string) => {
    return selectedUsers.includes(user);
  };

  const hasSelectedUsers = selectedUsers.length > 0;

  return (
    <ViewControlContext.Provider
      value={{
        toggleUser,
        checkUserIsSelected,
        hasSelectedUsers,
        hideDrafts,
        setHideDrafts,
        hideReady,
        setHideReady,
        selectedUsers,
        filterByUser,
        setFilterByUser,
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
