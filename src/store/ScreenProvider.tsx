import { createContext, useState } from "react";

type Screen = 'login' | 'game' | 'scores';

export const ScreenContext = createContext<{ screen: Screen, setScreen?: (nextScreen: Screen) => void}>({
  screen: 'login',
});

export function ScreenProvider({ children }: React.PropsWithChildren) {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');

  return (
    <ScreenContext.Provider value={{
      screen: currentScreen,
      setScreen: setCurrentScreen
    }}>
      {children}
    </ScreenContext.Provider>
  )
}