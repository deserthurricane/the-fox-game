import { useEffect, useState } from "react";
import { Button } from "../../components";
import { ScoresManager } from "../../store/StorageManager";
import { ScoreboardComponent } from "./ScoreboardComponent";

export function ScoreboardContainer() {
  // @TODO get from storage
  const [sortedScores, setSortedScores] = useState<ScoresDTO[] | undefined>();

  useEffect(() => {
    const scoresStorage = new ScoresManager();
    const scores = scoresStorage.getScores();

    if (Array.isArray(scores) && scores.length > 0) {
      setSortedScores(scores.sort((score1, score2) => score2.score - score1.score));
    } 
  }, []);

  if (!sortedScores) {
    return null;
  }

  return (
    <>
      <h2>SCOREBOARD</h2>
      <ScoreboardComponent scores={sortedScores} />
      <div>
        <Button
          text="To Welcome Screen"
        />
        <Button
          text="PLAY!"
        />
      </div>
    </>
  )
}