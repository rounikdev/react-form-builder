import { CSSProperties, FC, HTMLProps, memo, useCallback, useState } from 'react';

const getImageStyle = (naturalHeight: number, naturalWidth: number): CSSProperties => {
  let dimension = 'width';

  if (naturalHeight > naturalWidth) {
    dimension = 'height';
  }

  return {
    [dimension]: '100%'
  };
};

type ImageProps = HTMLProps<HTMLImageElement>;

export const Image: FC<ImageProps> = memo(({ alt, className, src }) => {
  const [status, setStatus] = useState({
    error: false,
    loaded: false,
    loading: true,
    naturalHeight: null,
    naturalWidth: null,
    style: { width: '100%' } as CSSProperties
  });

  const onErrorHandler = useCallback(() => {
    setStatus((currentStatus) => {
      return {
        ...currentStatus,
        error: true,
        loaded: false,
        loading: false
      };
    });
  }, []);

  const onLoadHandler = useCallback(({ target: { naturalHeight, naturalWidth } }) => {
    setStatus({
      error: false,
      loaded: true,
      loading: false,
      naturalHeight,
      naturalWidth,
      style: getImageStyle(naturalHeight, naturalWidth)
    });
  }, []);

  return src ? (
    <img
      alt={alt}
      className={className}
      onError={onErrorHandler}
      onLoad={onLoadHandler}
      src={src}
      style={status.style}
    />
  ) : null;
});

Image.displayName = 'Image';
