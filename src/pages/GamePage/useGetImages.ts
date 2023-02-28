import { useCallback, useEffect, useRef, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { GET_DOGS, GET_CATS, GET_FOX } from '../../api/endpoints';
import { AnimalImage, preloadImage, shuffleArray } from './helpers';

export const NON_FOXES_IMAGES_COUNT = 4;
export const FOXES_IMAGES_COUNT = 1;

/**
 * Getting and merging images from different APIs
 */
export function useGetImages(round: number): {
  imagesOneRound: AnimalImage[];
  isLoading: boolean;
  error: string;
} {
  const imagesRef = useRef<Record<'dogs' | 'cats' | 'foxes', AnimalImage[]>>();
  const [imagesOneRound, setImagesOneRound] = useState<AnimalImage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getImages: (
    isFirstCall: boolean,
  ) => Promise<Record<'dogs' | 'cats' | 'foxes', AnimalImage[]> | undefined> = useCallback(
    async (isFirstCall) => {
      // Make the initial images buffer bigger for smooth gameplay
      const dogsCount = isFirstCall ? NON_FOXES_IMAGES_COUNT * 5 : NON_FOXES_IMAGES_COUNT * 2;
      const catsCount = isFirstCall ? NON_FOXES_IMAGES_COUNT * 5 : NON_FOXES_IMAGES_COUNT * 2;
      const foxesCount = isFirstCall ? FOXES_IMAGES_COUNT * 5 : FOXES_IMAGES_COUNT * 2;

      // Need to call Cats and Foxes APIs multiple times due to API restrictions
      const foxesPromises: Array<Promise<AxiosResponse<FOX_API_RESPONSE>>> = [];

      for (let i = 0; i < foxesCount; i++) {
        foxesPromises.push(axios.get(GET_FOX()));
      }

      const catsRequestsCount = isFirstCall ? 2 : 1;
      const catsPromises: Array<Promise<AxiosResponse<CAT_API_RESPONSE>>> = [];

      for (let i = 0; i < catsRequestsCount; i++) {
        catsPromises.push(axios.get(GET_CATS(catsCount)));
      }

      try {
        const fetchPromises: [
          Promise<AxiosResponse<DOG_API_RESPONSE>>,
          ...Array<Promise<AxiosResponse<CAT_API_RESPONSE>>>,
          ...Array<Promise<AxiosResponse<FOX_API_RESPONSE>>>,
        ] = [axios.get(GET_DOGS(dogsCount)), ...catsPromises, ...foxesPromises];

        const [dogsData, ...otherData] = await Promise.all(fetchPromises);

        const dogs = dogsData.data.message.map((dogUrl) => ({ url: dogUrl, isFox: false }));

        const cats = [
          ...otherData
            .slice(0, catsRequestsCount)
            .flatMap((arr) => arr.data as AxiosResponse<CAT_API_RESPONSE>['data']),
        ]
          .slice(0, catsCount)
          .map((data) => ({ url: data.url, isFox: false }));

        const foxes = otherData.slice(-foxesCount).flatMap(({ data }) => ({
          url: (data as AxiosResponse<FOX_API_RESPONSE>['data']).image,
          isFox: true,
        }));

        const animals: AnimalImage[] = [...dogs, ...cats, ...foxes];

        // Cache received images for faster painting
        await Promise.all(animals.map(async (animal) => await preloadImage(animal.url)));

        return {
          dogs,
          cats,
          foxes,
        };
      } catch (error) {
        if (typeof error === 'object' && error !== null) {
          const errorText = error.hasOwnProperty('message')
            ? (error as Error).message
            : JSON.stringify(error);
          setError(errorText);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (round % 2 !== 0) {
      if (imagesRef.current) {
        // Clean up used images
        imagesRef.current = {
          dogs: imagesRef.current.dogs.slice(NON_FOXES_IMAGES_COUNT),
          cats: imagesRef.current.cats.slice(NON_FOXES_IMAGES_COUNT),
          foxes: imagesRef.current.foxes.slice(FOXES_IMAGES_COUNT),
        };

        setImagesOneRound(
          [
            ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
            ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
            ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT),
          ].sort(shuffleArray),
        );
      }

      // Add new images to the buffer on odd rounds
      getImages(round === -1).then((images) => {
        if (!images) return;

        if (round === -1) {
          imagesRef.current = {
            dogs: images.dogs,
            cats: images.cats,
            foxes: images.foxes,
          };

          setImagesOneRound(
            [
              ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
              ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
              ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT),
            ].sort(shuffleArray),
          );
        } else {
          if (imagesRef.current) {
            imagesRef.current = {
              dogs: imagesRef.current.dogs.concat(images.dogs),
              cats: imagesRef.current.cats.concat(images.cats),
              foxes: imagesRef.current.foxes.concat(images.foxes),
            };
          }
        }

        setIsLoading(false);
      });
    }

    if (round !== 0 && round % 2 === 0) {
      if (!imagesRef.current) return;

      // Clean up used images
      imagesRef.current = {
        dogs: imagesRef.current.dogs.slice(NON_FOXES_IMAGES_COUNT),
        cats: imagesRef.current.cats.slice(NON_FOXES_IMAGES_COUNT),
        foxes: imagesRef.current.foxes.slice(FOXES_IMAGES_COUNT),
      };

      setImagesOneRound(
        [
          ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
          ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
          ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT),
        ].sort(shuffleArray),
      );
    }

    // When images buffer is almost empty, we need to block interface from user interaction
    const needToShowIsLoading =
      imagesRef.current &&
      ([imagesRef.current.dogs.length, imagesRef.current.cats.length].some(
        (imagesBuffer) => imagesBuffer === NON_FOXES_IMAGES_COUNT,
      ) ||
        imagesRef.current.foxes.length === FOXES_IMAGES_COUNT);

    if (needToShowIsLoading) {
      setIsLoading(true);
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
    isLoading,
    error,
  };
}
