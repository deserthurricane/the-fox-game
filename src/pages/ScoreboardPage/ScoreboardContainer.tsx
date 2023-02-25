import { useCallback, useContext, useEffect, useState } from "react";
import { Button } from "../../components";
import { ScreenContext } from "../../store/ScreenProvider";
import { ScoresManager } from "../../store/StorageManager";
import { UserContext } from "../../store/UserProvider";
import { ScoreboardComponent } from "./ScoreboardComponent";

import './styles.css';

export function ScoreboardContainer() {
  const [sortedScores, setSortedScores] = useState<ScoreDTO[] | undefined>();

  const { setScreen } = useContext(ScreenContext);
  const { setUser } = useContext(UserContext);

  useEffect(() => {
    const scoresStorage = new ScoresManager();
    const scores = scoresStorage.getScores();

    if (Array.isArray(scores) && scores.length > 0) {
      setSortedScores(scores.sort((score1, score2) => score2.score - score1.score));
    } 
  }, []);

  const goToWelcomeScreen = useCallback(() => {
    if (typeof setScreen === 'function' && typeof setUser === 'function') {
      setUser((user) => ({
        ...user,
        score: 0,
      }));
      setScreen('login');
    }
  }, [setScreen, setUser]);

  const goToGameScreen = useCallback(() => {
    if (typeof setScreen === 'function') {
      setUser((user) => ({
        ...user,
        score: 0,
      }));

      setScreen('game');
    }
  }, [setScreen]);

  if (!sortedScores) {
    return null;
  }

  return (
    <div className="scoreboard_container">
      <h2 className="title">SCOREBOARD</h2>
      <ScoreboardComponent scores={sortedScores} />
      <div className="buttons_container">
        <Button
          text="To Welcome Screen"
          onClick={goToWelcomeScreen}
        />
        <Button
          text="PLAY!"
          onClick={goToGameScreen}
        />
      </div>
    </div>
  )
}