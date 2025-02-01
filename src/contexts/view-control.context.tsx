import * as React from "react";
import { useLocalStorage } from "~/hooks/use-local-storage";

interface ViewControlContextType {
  selectedUser: string;
  setSelectedUser: (user: string) => void;
}

const ViewControlContext = React.createContext<ViewControlContextType | undefined>(
  undefined,
);

export function ViewControlProvider({ children }: { children: React.ReactNode }) {
  const [selectedUser, setSelectedUser] = useLocalStorage<string>(
    "selectedUser",
    "",
  );

  return (
    <ViewControlContext.Provider
      value={{
        selectedUser,
        setSelectedUser,
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
