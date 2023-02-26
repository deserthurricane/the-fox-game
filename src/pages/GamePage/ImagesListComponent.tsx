import { memo } from 'react';
import { AnimalImage } from './helpers';
import './styles.css';


type ImagesListComponentProps = {
  images: AnimalImage[];
  onClick: (isFox: boolean) => void;
}

export const ImagesListComponent = memo((
  ({
    images,
    onClick
  }: ImagesListComponentProps
) => {
    return (
      <div className="images_container" data-testid="images_container">
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