import React, { createContext, useState } from "react";

const initialUserValue = '';

export const UserContext = createContext<{ 
  user: string, 
  setUser: React.Dispatch<React.SetStateAction<string>>,
}>({
  user: initialUserValue,
  setUser: () => initialUserValue,
});

/**
 * Context that provides user value and its' setter
 */
export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<string>(initialUserValue);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
    }}>
      {children}
    </UserContext.Provider>
  )
}