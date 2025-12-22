import { createContext, useEffect, useState, ReactNode, Dispatch, SetStateAction } from "react";
import axios from "axios";
import { User } from "./types";

interface UserContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  ready: boolean;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => { },
  ready: false,
});

interface UserContextProviderProps {
  children: ReactNode;
}

export function UserContextProvider({ children }: UserContextProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!user) {
      axios.get("/profile").then(({ data }) => {
        // Check if data is not empty object
        if (data && Object.keys(data).length > 0) {
          setUser(data);
        }
        setReady(true);
      });
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ user, setUser, ready }}>
      {children}
    </UserContext.Provider>
  );
}
