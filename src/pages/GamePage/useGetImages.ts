import { useCallback, useEffect, useRef, useState } from 'react';
import { 
  CAT_API, 
  FOXES_IMAGES_COUNT, 
  FOX_API, 
  NON_FOXES_IMAGES_COUNT, 
  PRELOADED_NON_FOXES_IMAGES_COUNT,
} from './../../api/constants';
import { DOG_API } from '../../api/constants';
import { preloadImage, shuffleArray } from './helpers';

export type AnimalImage = {
  url: string;
  isFox: boolean;
};

export function useGetImages(round: number): { imagesOneRound: AnimalImage[], error: string } {
  const imagesRef = useRef<Record<"dogs" | "cats" | "foxes", AnimalImage[]>>();
  const [imagesOneRound, setImagesOneRound] = useState<AnimalImage[]>([]);
  const [error, setError] = useState<string>("");

  const getImages: () => Promise<
    Record<"dogs" | "cats" | "foxes", AnimalImage[]> | undefined
  > = useCallback(async () => {
    try {
      const promises: [
        Promise<DOG_API_RESPONSE>, 
        // Promise<CAT_API_RESPONSE>, 
        // Promise<FOX_API_RESPONSE>, 
        // Promise<FOX_API_RESPONSE>,
      ] = [
        fetch(DOG_API).then((response) => response.json()),
        // fetch(CAT_API).then((response) => response.json()),
        // fetch(FOX_API).then((response) => response.json()),
        // fetch(FOX_API).then((response) => response.json())
      ];

      const [dogsData /* , catsData, fox1Data, fox2Data */] = await Promise.all(
        promises
      );

      const preloadedImagesPromises = [
        ...dogsData.message.map((dogUrl) => preloadImage(dogUrl, false)),
        // ...catsData
        //   .slice(0, PRELOADED_NON_FOXES_IMAGES_COUNT)
        //   .map(({ url }) => preloadImage(url, false)),
        // preloadImage(fox1Data.image, true),
        // preloadImage(fox2Data.image, true)
      ];

      const animals = await Promise.all(preloadedImagesPromises);

      return {
        dogs: animals.slice(0, PRELOADED_NON_FOXES_IMAGES_COUNT),
        // cats: animals.slice(
        //   PRELOADED_NON_FOXES_IMAGES_COUNT,
        //   PRELOADED_NON_FOXES_IMAGES_COUNT * 2
        // ),
        // foxes: animals.slice(PRELOADED_NON_FOXES_IMAGES_COUNT * 2)
      };

      // console.log(dogsData, 'dogsData');

      // return { dogs: dogsData };


    } catch (error) {
      // @TODO
      console.log(error, 'error on getImages');
      if (typeof error === 'object' && error !== null) {
        setError(error.toString());
      }
    }
  }, []);

  useEffect(() => {
    if (round % 2 !== 0) {
      if (imagesRef.current) {
        setImagesOneRound(
          [
            ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
            // ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
            // ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT)
          ].sort(shuffleArray)
        );
      }

      getImages().then((images) => {
        if (!images) return;

        console.log(images, 'images');
        
        imagesRef.current = images;

        console.log(imagesRef.current, 'imagesRef.current')

        if (round === -1) {
          const arr = [
              ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
              // ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
              // ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT)
            ].sort(shuffleArray);

            console.log(arr, )

          setImagesOneRound(
            arr
          );
        }
      });
    }

    if (round !== 0 && round % 2 === 0) {
      if (!imagesRef.current) return;

      setImagesOneRound(
        [
          ...imagesRef.current.dogs.slice(NON_FOXES_IMAGES_COUNT),
          // ...imagesRef.current.cats.slice(NON_FOXES_IMAGES_COUNT),
          // ...imagesRef.current.foxes.slice(FOXES_IMAGES_COUNT)
        ].sort(shuffleArray)
      );
    }
  }, [round, getImages]);

  return {
    imagesOneRound,
    error
  };
}
