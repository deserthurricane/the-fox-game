import { useCallback, useContext, useEffect, useState } from 'react';
import { useGetImages } from './useGetImages';
import { useTimer } from './useTimer';
import { ScoresManager } from '../../store/StorageManager';
import { UserContext } from '../../store/UserProvider';
import { ScreenContext } from '../../store/ScreenProvider';
import { ImagesListComponent } from './ImagesListComponent';

/**
 * Game page container
 */
export function GameContainer() {
  const [foxCount, setFoxCount] = useState<number>(0);
  const [round, setRound] = useState<number>(-1);
  const [attemptsCount, setAttemptsCount] = useState(0);

  const { user, setUser } = useContext(UserContext);
  const { setScreen } = useContext(ScreenContext);

  const { imagesOneRound, error } = useGetImages(round);

  const remainingTimeSec = useTimer(round === 0);

  const onImageClick = useCallback((isFox: boolean) => {
    // Prevent multiple clicks on the same set of images
    const newAttemptsCount = attemptsCount + 1;

    if (newAttemptsCount - round > 1) {
      return;
    }

    setAttemptsCount(newAttemptsCount);

    if (isFox) {
      setFoxCount((foxCount) => foxCount + 1);
    } else {
      setFoxCount((foxCount) => (foxCount - 1 >= 0 ? foxCount - 1 : 0));
    }

    setRound(round + 1);
  }, [attemptsCount, round]);

  useEffect(() => {
    if (round === -1 && imagesOneRound.length > 0) {
      setRound(0);
    }
  }, [round, imagesOneRound]);

  useEffect(() => {
    if (remainingTimeSec === 0 && user) {
      const scoresStorage = ScoresManager.getInstance();
      scoresStorage.addScore({
        name: user,
        date: Date.now(),
        score: foxCount,
      });

      setScreen('scores');
    }
  }, [remainingTimeSec, user, foxCount, setScreen, setUser]);

  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  if (round === -1) {
    return <span>Is loading...</span>;
  }

  return (
    <div>
      <div className="info_container">
        <span>Score: {foxCount}</span>
        <span>&nbsp;&nbsp;Time left: {remainingTimeSec}</span>
      </div>
      <ImagesListComponent images={imagesOneRound} onClick={onImageClick} />
    </div>
  );
}
