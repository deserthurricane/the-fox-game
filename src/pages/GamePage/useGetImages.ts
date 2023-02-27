import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CAT_API,
  FOXES_IMAGES_COUNT,
  FOX_API,
  NON_FOXES_IMAGES_COUNT,
  PRELOADED_NON_FOXES_IMAGES_COUNT,
} from './../../api/constants';
import { DOG_API } from '../../api/constants';
import { AnimalImage, preloadImage, shuffleArray } from './helpers';

/**
 * Getting and merging images from different APIs
 */
export function useGetImages(round: number): { imagesOneRound: AnimalImage[]; error: string } {
  const imagesRef = useRef<Record<'dogs' | 'cats' | 'foxes', AnimalImage[]>>();
  const [imagesOneRound, setImagesOneRound] = useState<AnimalImage[]>([]);
  const [error, setError] = useState<string>('');

  const getImages: () => Promise<Record<'dogs' | 'cats' | 'foxes', AnimalImage[]> | undefined> =
    useCallback(async () => {
      try {
        const fetchPromises = [
          fetch(DOG_API),
          fetch(CAT_API),
          fetch(FOX_API),
          fetch(FOX_API),
        ];

        const blobData = await Promise.all(fetchPromises);

        const [dogsData, catsData, fox1Data, fox2Data]: [Promise<DOG_API_RESPONSE>, Promise<CAT_API_RESPONSE>, Promise<FOX_API_RESPONSE>, Promise<FOX_API_RESPONSE>] = await Promise.all(blobData.map(response => response.json()));

        console.log(dogsData, 'dogsData');
        

        const animals: AnimalImage[] = [
          ...dogsData.message.map((dogUrl) => ({ url: dogUrl, isFox: false })),
          ...catsData
            .slice(0, PRELOADED_NON_FOXES_IMAGES_COUNT)
            .map(({ url }) => ({ url, isFox: false })),
          { url: fox1Data.image, isFox: true },
          { url: fox2Data.image, isFox: true },
        ];

        animals.forEach(animal => preloadImage(animal.url, animal.isFox));

        // const animals = preloadedImagesPromises;

        return {
          dogs: animals.slice(0, PRELOADED_NON_FOXES_IMAGES_COUNT),
          cats: animals.slice(
            PRELOADED_NON_FOXES_IMAGES_COUNT,
            PRELOADED_NON_FOXES_IMAGES_COUNT * 2,
          ),
          foxes: animals.slice(PRELOADED_NON_FOXES_IMAGES_COUNT * 2),
        };
      } catch (error) {
        // @TODO
        console.log(error, 'error on getImages');
        if (typeof error === 'object' && error !== null) {
          setError(JSON.stringify(error));
        }
      }
    }, []);

  useEffect(() => {    
    if (round % 2 !== 0) {
      if (imagesRef.current) {
        setImagesOneRound(
          [
            ...imagesRef.current.dogs.slice(NON_FOXES_IMAGES_COUNT),
            ...imagesRef.current.cats.slice(NON_FOXES_IMAGES_COUNT),
            ...imagesRef.current.foxes.slice(FOXES_IMAGES_COUNT),
          ].sort(shuffleArray),
        );
      }

      getImages().then((images) => {
        if (!images) return;

        imagesRef.current = images;

        if (round === -1) {
          setImagesOneRound(
            [
              ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
              ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
              ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT),
            ].sort(shuffleArray),
          );
        }
      });
    }

    if (round !== 0 && round % 2 === 0) {
      if (!imagesRef.current) return;

      setImagesOneRound(
        [
          ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
          ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
          ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT),
        ].sort(shuffleArray),
      );
    }
  }, [round, getImages]);

  useEffect(() => {
    return () => {
      imagesRef.current = undefined;
      setImagesOneRound([]);
      setError('');
    };
  }, []);

  return {
    imagesOneRound,
    error,
  };
}
