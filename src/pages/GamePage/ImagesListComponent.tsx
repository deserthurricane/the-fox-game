import { memo } from 'react';
import { AnimalImage } from './helpers';
import cn from 'classnames';

import './styles.css';

type ImagesListComponentProps = {
  images: AnimalImage[];
  isDisabled: boolean;
  onClick: (isFox: boolean) => void;
};

/**
 * UI component for rendering game images
 */
export const ImagesListComponent = memo(
  ({ images, isDisabled, onClick }: ImagesListComponentProps) => {
    const containerClassName = cn('images_container', {
      images_container__loading: isDisabled,
    });

    return (
      <div className={containerClassName} data-testid="images_container">
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
  },
);
