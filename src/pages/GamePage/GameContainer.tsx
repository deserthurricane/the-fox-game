import { ForwardedRef, forwardRef, memo, useCallback, useContext, useEffect, useState } from "react";
import { AnimalImage, useGetImages } from "./useGetImages";
import { useTimer } from './useTimer';
import { ScoresManager } from '../../store/StorageManager';
import { UserContext } from "../../store/UserProvider";
import { ScreenContext } from "../../store/ScreenProvider";
import { useCallbackRef } from './useCallbackRef';

import "./styles.css";


type ImagesListComponentProps = {
  images: AnimalImage[];
  onClick: (isFox: boolean) => void;
}

const ImagesListComponent = memo(forwardRef(
  ({
    images,
    onClick
  }: ImagesListComponentProps, ref: ForwardedRef<HTMLDivElement>) => {
    return (
      <div ref={ref} className="container">
        {images.map(({ url, isFox }) => (
          <img
            key={url}
            alt="Animal: dog, cat or fox"
            src={url}
            className="image"
            onClick={() => onClick(isFox)}
          />
        ))}
      </div>
    );
  }
));

export function GameContainer() {
  const [foxCount, setFoxCount] = useState<number>(0);
  const [round, setRound] = useState<number>(-1);

  const { data, setUser } = useContext(UserContext);
  const { setScreen } = useContext(ScreenContext);

  const { imagesOneRound, error } = useGetImages(round);

  const [imagesListRef, getImagesListRef] = useCallbackRef();

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
    if (remainingTimeSec === 0 && data?.name && typeof setScreen === 'function') {
      const scoresStorage = new ScoresManager();
      scoresStorage.addScore({
        name: data.name,
        date: Date.now(),
        score: foxCount,
      });

      setUser({
        name: data.name,
        score: foxCount,
      });

      setScreen('scores');
    }

  }, [remainingTimeSec, data.name, foxCount, setScreen, setUser]);

  console.log(imagesListRef, 'imagesListRef');  

  if (round === -1) {
    return <span>Is loading...</span>;
  }

  return (
    <div>
      <span>Score: {foxCount}</span>
      <span>&nbsp;&nbsp;Time left: {remainingTimeSec}</span>
      <ImagesListComponent ref={getImagesListRef} images={imagesOneRound} onClick={onImageClick} />
    </div>
  );
}
