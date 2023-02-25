import { log } from "console";
import { useCallback, useEffect, useRef, useState } from "react";

function shuffleArray() {
  return Math.random() - 0.5;
}

function preloadImage(imageUrl: string, isFox: boolean): Promise<AnimalImage> {
  return new Promise((resolve) => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      resolve({
        url: imageUrl,
        isFox
      });
    };
  });
}

const NON_FOXES_IMAGES_COUNT = 4;
const PRELOADED_NON_FOXES_IMAGES_COUNT = NON_FOXES_IMAGES_COUNT * 2;
const FOXES_IMAGES_COUNT = 1;
const PRELOADED_FOXES_IMAGES_COUNT = FOXES_IMAGES_COUNT * 2;

const DOG_API = `https://dog.ceo/api/breeds/image/random/${PRELOADED_NON_FOXES_IMAGES_COUNT}`;
const CAT_API = `https://api.thecatapi.com/v1/images/search?limit=${PRELOADED_NON_FOXES_IMAGES_COUNT}`;
const FOX_API = "https://randomfox.ca/floof";

export type AnimalImage = {
  url: string;
  isFox: boolean;
};

export function useGetImages(round: number) {
  const imagesRef = useRef<Record<"dogs" | "cats" | "foxes", AnimalImage[]>>();
  const [imagesOneRound, setImagesOneRound] = useState<AnimalImage[]>([]);
  const [error, setError] = useState<string>("");

  const getImages: () => Promise<
    Record<"dogs" | "cats" | "foxes", AnimalImage[]>
  > = useCallback(async () => {
    try {
      const promises = [
        fetch(DOG_API).then((response) => response.json()),
        fetch(CAT_API).then((response) => response.json()),
        fetch(FOX_API).then((response) => response.json()),
        fetch(FOX_API).then((response) => response.json())
      ];

      const [dogsData, catsData, fox1Data, fox2Data] = await Promise.all(
        promises
      );

      const preloadedImagesPromises = [
        ...dogsData.message.map((dogUrl) => preloadImage(dogUrl, false)),
        ...catsData
          .slice(0, PRELOADED_NON_FOXES_IMAGES_COUNT)
          .map(({ url }) => preloadImage(url, false)),
        preloadImage(fox1Data.image, true),
        preloadImage(fox2Data.image, true)
      ];

      const animals = await Promise.all(preloadedImagesPromises);

      return {
        dogs: animals.slice(0, PRELOADED_NON_FOXES_IMAGES_COUNT),
        cats: animals.slice(
          PRELOADED_NON_FOXES_IMAGES_COUNT,
          PRELOADED_NON_FOXES_IMAGES_COUNT * 2
        ),
        foxes: animals.slice(PRELOADED_NON_FOXES_IMAGES_COUNT * 2)
      };
    } catch (error) {
      // @TODO
      console.log(error);
      setError(error.toString());
    }
  }, []);

  useEffect(() => {
    console.log(round, "round");
    if (round % 2 !== 0) {
      if (imagesRef.current) {
        setImagesOneRound(
          [
            ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
            ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
            ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT)
          ].sort(shuffleArray)
        );
      }

      getImages().then((images) => {
        imagesRef.current = images;

        if (round === -1) {
          setImagesOneRound(
            [
              ...imagesRef.current.dogs.slice(0, NON_FOXES_IMAGES_COUNT),
              ...imagesRef.current.cats.slice(0, NON_FOXES_IMAGES_COUNT),
              ...imagesRef.current.foxes.slice(0, FOXES_IMAGES_COUNT)
            ].sort(shuffleArray)
          );
        }
      });
    }

    if (round !== 0 && round % 2 === 0) {
      // console.log("round !== 0 && round % 2 !== 0");
      if (!imagesRef.current) return;

      setImagesOneRound(
        [
          ...imagesRef.current.dogs.slice(NON_FOXES_IMAGES_COUNT),
          ...imagesRef.current.cats.slice(NON_FOXES_IMAGES_COUNT),
          ...imagesRef.current.foxes.slice(FOXES_IMAGES_COUNT)
        ].sort(shuffleArray)
      );
    }
  }, [round, getImages]);

  // console.log(imagesOneRound, "imagesOneRound");

  return {
    imagesOneRound,
    error
  };
}
