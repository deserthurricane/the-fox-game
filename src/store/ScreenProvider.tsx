import { createContext, useState } from 'react';

type Screen = 'login' | 'game' | 'scores';

const initialScreenValue: Screen = 'login';

export const ScreenContext = createContext<{
  screen: Screen;
  setScreen: React.Dispatch<React.SetStateAction<Screen>>;
}>({
  screen: 'login',
  setScreen: () => initialScreenValue,
});

/**
 * Context that provides current screen value and its' setter
 */
export function ScreenProvider({ children }: React.PropsWithChildren) {
  const [currentScreen, setCurrentScreen] = useState<Screen>(initialScreenValue);

  return (
    <ScreenContext.Provider
      value={{
        screen: currentScreen,
        setScreen: setCurrentScreen,
      }}
    >
      {children}
    </ScreenContext.Provider>
  );
}
