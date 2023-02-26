import { useCallback, useContext, useEffect, useState } from 'react';
import { Button } from '../../components';
import { ScreenContext } from '../../store/ScreenProvider';
import { ScoresManager } from '../../store/StorageManager';
import { ScoreboardComponent } from './ScoreboardComponent';

import './styles.css';

/**
 * Scoreboard page container
 */
export function ScoreboardContainer() {
  const [sortedScores, setSortedScores] = useState<ScoreDTO[] | undefined>();

  const { setScreen } = useContext(ScreenContext);

  useEffect(() => {
    const scoresStorage = ScoresManager.getInstance();
    const scores = scoresStorage.getScores();

    if (Array.isArray(scores) && scores.length > 0) {
      setSortedScores(scores.sort((score1, score2) => score2.score - score1.score));
    }
  }, []);

  const goToWelcomeScreen = useCallback(() => {
    setScreen('login');
  }, [setScreen]);

  const goToGameScreen = useCallback(() => {
    setScreen('game');
  }, [setScreen]);

  if (!sortedScores) {
    return null;
  }

  return (
    <div className="scoreboard_container">
      <h2 className="title">SCOREBOARD</h2>
      <ScoreboardComponent scores={sortedScores} />
      <div className="buttons_container">
        <Button text="To Welcome Screen" onClick={goToWelcomeScreen} />
        <Button text="PLAY!" onClick={goToGameScreen} />
      </div>
    </div>
  );
}
