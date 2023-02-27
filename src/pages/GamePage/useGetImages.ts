import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
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
      // Clean loaded data
      imagesRef.current = undefined;

      try {
        const fetchPromises: [
          Promise<AxiosResponse<DOG_API_RESPONSE>>, 
          Promise<AxiosResponse<CAT_API_RESPONSE>>, 
          Promise<AxiosResponse<FOX_API_RESPONSE>>, 
          Promise<AxiosResponse<FOX_API_RESPONSE>>
        ] = [
          axios.get(DOG_API),
          axios.get(CAT_API),
          axios.get(FOX_API),
          axios.get(FOX_API),
        ];

        const [dogsData, catsData, fox1Data, fox2Data] = await Promise.all(fetchPromises);        

        const animals: AnimalImage[] = [
          ...dogsData.data.message.map((dogUrl) => ({ url: dogUrl, isFox: false })),
          ...catsData.data
            .slice(0, PRELOADED_NON_FOXES_IMAGES_COUNT)
            .map(({ url }) => ({ url, isFox: false })),
          { url: fox1Data.data.image, isFox: true },
          { url: fox2Data.data.image, isFox: true },
        ];

        // Cache received images
        await Promise.all(animals.map(animal => preloadImage(animal.url, animal.isFox)));
        
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
