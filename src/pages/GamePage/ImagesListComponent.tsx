import { memo } from "react";
import "./styles.css";
import { AnimalImage } from "./useGetImages";


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
      <div className="container">
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