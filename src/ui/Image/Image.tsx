import { CSSProperties, FC, memo, ReactEventHandler, useCallback, useMemo, useState } from 'react';

import { useUpdateOnly } from '@rounik/react-custom-hooks';

import { Stylable, Testable } from '@types';

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

interface ImageProps extends Stylable, Testable {
  alt: string;
  src: string;
}

interface ImageState {
  error: boolean;
  style: CSSProperties;
}

const defaultState: ImageState = { error: false, style: { opacity: 0, width: '100%' } };

export const Image: FC<ImageProps> = memo(({ alt, className, dataTest, src }) => {
  const [state, setState] = useState<ImageState>(defaultState);

  const showImage = useMemo(() => src && !state.error, [src, state.error]);

  const onLoadHandler: ReactEventHandler<HTMLImageElement> = useCallback((event) => {
    const target = event.target as HTMLImageElement;
    const { naturalHeight, naturalWidth } = target;

    setState((currentState) => ({
      ...currentState,
      style: getImageStyle(naturalHeight, naturalWidth)
    }));
  }, []);

  const onErrorHandler = useCallback(() => {
    setState((currentState) => ({
      ...currentState,
      error: true,
      style: { height: '100%', width: '100%' }
    }));
  }, []);

  useUpdateOnly(() => {
    setState(() => defaultState);
  }, [src]);

  return showImage ? (
    <img
      alt={alt}
      className={className}
      data-test={`${dataTest}-image`}
      onError={onErrorHandler}
      onLoad={onLoadHandler}
      src={src}
      style={state.style}
    />
  ) : (
    <div data-test={`${dataTest}-image-error`} style={state.style} />
  );
});

Image.displayName = 'Image';
