import React, { createContext, useState } from "react";

const initialUserValue = {
  name: '',
  score: 0,
}

export const UserContext = createContext<{ 
  user: UserData, 
  setUser: React.Dispatch<React.SetStateAction<UserData>>, // ReturnType<typeof useState<UserData>>[1],
}>({
  user: initialUserValue,
  setUser: () => initialUserValue,
});

export function UserProvider({ children }: React.PropsWithChildren) {
  const [user, setUser] = useState<UserData>(initialUserValue);

  return (
    <UserContext.Provider value={{
      user: {
        name: user.name,
        score: user.score,
      },
      setUser,
    }}>
      {children}
    </UserContext.Provider>
  )
}