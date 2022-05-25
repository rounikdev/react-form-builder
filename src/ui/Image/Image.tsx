import { CSSProperties, FC, memo, useCallback, useState } from 'react';

import { Stylable } from '../../types';

const getImageStyle = (naturalHeight: number, naturalWidth: number): CSSProperties => {
  let dimension = 'width';

  if (naturalHeight > naturalWidth) {
    dimension = 'height';
  }

  return {
    [dimension]: '100%'
  };
};

interface ImageProps extends Stylable {
  alt: string;
  src: string;
}

export const Image: FC<ImageProps> = memo(({ alt, className, src }) => {
  const [state, setState] = useState({
    style: { width: '100%' } as CSSProperties
  });

  const onLoadHandler = useCallback(({ target: { naturalHeight, naturalWidth } }) => {
    setState({
      style: getImageStyle(naturalHeight, naturalWidth)
    });
  }, []);

  return src ? (
    <img alt={alt} className={className} onLoad={onLoadHandler} src={src} style={state.style} />
  ) : null;
});

Image.displayName = 'Image';
