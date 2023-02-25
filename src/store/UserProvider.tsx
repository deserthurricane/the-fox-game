import { createContext, useState } from "react";

export const UserContext = createContext<{ data: UserData, setUser: (updatedUserData: UserData) => void}>({
  data: {
    name: '',
    score: 0,
  },
  setUser: (updatedUserData: UserData) => undefined,
});

export function UserProvider({ children }) {
  const [user, setUser] = useState<UserData>({});

  return (
    <UserContext.Provider value={{
      data: {
        name: user.name,
        score: user.score,
      },
      setUser,
    }}>
      {children}
    </UserContext.Provider>
  )
}