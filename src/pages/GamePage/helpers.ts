export type AnimalImage = {
  url: string;
  isFox: boolean;
};

export function shuffleArray() {
  return Math.random() - 0.5;
}

/**
 * Force browser to cache images
 * and resolve them via Image onload event callback
 */
export async function preloadImage(imageUrl: string): Promise<boolean> {
  return await new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      resolve(true);
    };

    image.onerror = () => {
      reject(new Error('Image is not found'));
    };
  });
}
