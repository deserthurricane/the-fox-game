import { useEffect, useRef, useState } from 'react';

const ONE_ROUND_TIME_SEC = 3600;

/**
 * Hook for counting remaining time
 */
export function useTimer(areImagesVisible: boolean): number {
  const [remainingTimeSec, setRemainingTimeSec] = useState<number>(ONE_ROUND_TIME_SEC);

  const interval = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (areImagesVisible) {
      let remainingSec = ONE_ROUND_TIME_SEC;

      interval.current = setInterval(() => {
        remainingSec--;
        setRemainingTimeSec(remainingSec);

        if (remainingSec === 0) {
          clearInterval(interval.current);
        }
      }, 1000);
    }
  }, [areImagesVisible]);

  useEffect(() => {
    return () => {
      if (interval.current) {
        clearInterval(interval.current);
      }
    };
  }, []);

  return remainingTimeSec;
}
