import { useCallback, useContext, useEffect, useState } from "react";
import { useGetImages } from "./useGetImages";
import { useTimer } from './useTimer';
import { ScoresManager } from '../../store/StorageManager';
import { UserContext } from "../../store/UserProvider";
import { ScreenContext } from "../../store/ScreenProvider";
import { ImagesListComponent } from "./ImagesListComponent";

export function GameContainer() {
  const [foxCount, setFoxCount] = useState<number>(0);
  const [round, setRound] = useState<number>(-1);

  const { user, setUser } = useContext(UserContext);
  const { setScreen } = useContext(ScreenContext);

  const { imagesOneRound, error } = useGetImages(round);

  const remainingTimeSec = useTimer(round === 0);

  const onImageClick = useCallback((isFox: boolean) => {
    if (isFox) {
      setFoxCount((foxCount) => foxCount + 1);
    } else {
      setFoxCount((foxCount) => (foxCount - 1 >= 0 ? foxCount - 1 : 0));
    }

    setRound((round) => round + 1);
  }, []);

  useEffect(() => {
    if (round === -1 && imagesOneRound.length > 0) {
      setRound(0);
    }
  }, [round, imagesOneRound]);

  useEffect(() => {
    if (remainingTimeSec === 0 && user?.name && typeof setScreen === 'function') {
      const scoresStorage = new ScoresManager();
      scoresStorage.addScore({
        name: user.name,
        date: Date.now(),
        score: foxCount,
      });

      setUser({
        name: user.name,
        score: foxCount,
      });

      setScreen('scores');
    }

  }, [remainingTimeSec, user.name, foxCount, setScreen, setUser]);

  if (round === -1) {
    return <span>Is loading...</span>;
  }

  return (
    <div>
      <span>Score: {foxCount}</span>
      <span>&nbsp;&nbsp;Time left: {remainingTimeSec}</span>
      <ImagesListComponent images={imagesOneRound} onClick={onImageClick} />
    </div>
  );
}
