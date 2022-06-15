import { FC } from 'react';

interface LinkProps {
  link: any;
}

export const Link: FC<LinkProps> = ({ link }) => {
  return (
    <g>
      <line
        markerEnd="url(#triangle)"
        x1={link.source.x}
        y1={link.source.y}
        x2={link.target.x}
        y2={link.target.y}
        stroke="gray"
        strokeWidth={1}
      />
    </g>
  );
};

Link.displayName = 'Link';
