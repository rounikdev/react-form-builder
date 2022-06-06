import { CSSProperties, FC, memo, useCallback, useMemo, useState } from 'react';

import { useUpdateOnly } from '@rounik/react-custom-hooks';

import { Stylable } from '../../types';

const getImageStyle = (naturalHeight: number, naturalWidth: number): CSSProperties => {
  let dimension = 'width';

  if (naturalHeight > naturalWidth) {
    dimension = 'height';
  }

  return {
    [dimension]: '100%',
    opacity: 1
  };
};

interface ImageProps extends Stylable {
  alt: string;
  src: string;
}

interface ImageState {
  error: boolean;
  style: CSSProperties;
}

const defaultState: ImageState = { error: false, style: { width: '100%', opacity: 0 } };

export const Image: FC<ImageProps> = memo(({ alt, className, src }) => {
  const [state, setState] = useState<ImageState>(defaultState);

  const showImage = useMemo(() => src && !state.error, [src, state.error]);

  const onLoadHandler = useCallback(({ target: { naturalHeight, naturalWidth } }) => {
    setState((currentState) => ({
      ...currentState,
      style: getImageStyle(naturalHeight, naturalWidth)
    }));
  }, []);

  const onErrorHandler = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      error: true,
      style: { width: '100%', height: '100%' }
    }));
  }, []);

  useUpdateOnly(() => {
    setState(() => defaultState);
  }, [src]);

  return showImage ? (
    <img
      alt={alt}
      className={className}
      onError={onErrorHandler}
      onLoad={onLoadHandler}
      src={src}
      style={state.style}
    />
  ) : (
    <div style={state.style} />
  );
});

Image.displayName = 'Image';
