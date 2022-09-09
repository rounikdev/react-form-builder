import { IMAGES } from './images';

export const images = [
  {
    alt: 'cat-1',
    id: 1,
    src: IMAGES.image1
  },
  {
    alt: 'cat-2',
    id: 2,
    src: IMAGES.image2
  },
  {
    alt: 'cat-3',
    id: 3,
    src: IMAGES.image3
  },
  {
    alt: 'cat-4',
    id: 4,
    src: IMAGES.image4
  },
  {
    alt: 'cat-5',
    id: 5,
    src: IMAGES.image5
  },
  {
    alt: 'cat-6',
    id: 6,
    src: IMAGES.image6
  },
  {
    alt: 'cat-7',
    id: 7,
    src: IMAGES.image7
  },
  {
    alt: 'cat-8',
    id: 8,
    src: 'https://some-non-existing-image.png'
  }
];

export const images2 = [
  {
    alt: 'hamster-1',
    id: 1,
    src: IMAGES.image8
  },
  {
    alt: 'hamster-2',
    id: 2,
    src: IMAGES.image9
  },
  {
    alt: 'hamster-3',
    id: 3,
    src: IMAGES.image10
  }
];

export interface Picture {
  alt: string;
  id: number;
  src: string;
}
