import { memo } from 'react';
import { AnimalImage } from './helpers';
import './styles.css';

type ImagesListComponentProps = {
  images: AnimalImage[];
  onClick: (isFox: boolean) => void;
};

/**
 * UI component for rendering game images
 */
export const ImagesListComponent = memo(({ images, onClick }: ImagesListComponentProps) => {
  return (
    <div className="images_container" data-testid="images_container">
      {images.map(({ url, isFox }, index) => (
        <img
          // Prevent key collision when similar images are loaded
          key={`${url}_${index}`}
          alt="Animal: dog, cat or fox"
          src={url}
          className="image"
          onClick={() => onClick(isFox)}
        />
      ))}
    </div>
  );
});
