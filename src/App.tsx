import { memo, useContext, useMemo } from "react"
import { LoginContainer } from "./pages/LoginPage/LoginContainer";
import { GameContainer } from "./pages/GamePage/GameContainer";
import { ScreenContext, ScreenProvider } from "./store/ScreenProvider";
import { UserProvider } from "./store/UserProvider"
import { ScoreboardContainer } from "./pages/ScoreboardPage/ScoreboardContainer";
import { Layout } from "./components";

const AppComponent = memo(() => {
  const { screen } = useContext(ScreenContext);

  const Page = useMemo(() => {
    switch (screen) {
      case 'login':
        return <LoginContainer />;
      case 'game':
        return <GameContainer />;
      case 'scores':
        return <ScoreboardContainer />;
      default:
        return null;
    }
  }, [screen]);

  console.log('screen');

  return (
    <Layout>
      {Page}
    </Layout>
  )
});

export const App = () => {
  return (
    <ScreenProvider>
      <UserProvider>
        <AppComponent />
      </UserProvider>
    </ScreenProvider>
  )
}

