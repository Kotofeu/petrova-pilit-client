import { FC, memo, useState } from 'react';

interface IServerImage {
  className?: string;
  src: string;
  alt: string;
  title?: string;
  draggable?: boolean
  onClick?: () => void;
}

const ServerImage: FC<IServerImage> = memo(({ className, src, alt, title = alt, draggable = true, onClick }) => {
  const [hasError, setHasError] = useState(false);

  const imgBroke = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      event.currentTarget.src = src;
    }
  };

  return (
    <img
      className={className}
      src={hasError ? src : `${process.env.REACT_APP_API_URL}/${src}`}
      onError={imgBroke}
      alt={alt}
      title={title}
      aria-label={title}
      onClick={onClick}
      draggable = {draggable}
      loading="lazy"
    />
  );
});

export default ServerImage;