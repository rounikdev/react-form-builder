import { FC, useEffect } from 'react';

import { CanvasCamera } from '../../types';

interface LinkCanvasProps {
  camera: CanvasCamera;
  ctx: CanvasRenderingContext2D | null;
  link: any;
}

const drawArrow = ({
  angle,
  ctx,
  toX,
  toY
}: {
  angle: number; // in radians
  ctx: CanvasRenderingContext2D;
  toX: number;
  toY: number;
}) => {
  ctx.save();
  ctx.beginPath();
  ctx.translate(toX, toY);
  ctx.rotate(angle);
  ctx.moveTo(0, 0);
  ctx.lineTo(5, 20);
  ctx.lineTo(-5, 20);
  ctx.closePath();
  ctx.restore();
  ctx.fill();
};

export const LinkCanvas: FC<LinkCanvasProps> = ({ camera, ctx, link }) => {
  useEffect(() => {
    if (!ctx) {
      return;
    }

    ctx.strokeStyle = 'lightgray';

    ctx.moveTo(
      (link.source.x + camera.pan.x) * camera.zoom,
      (link.source.y + camera.pan.y) * camera.zoom
    );

    ctx.lineTo(
      (link.target.x + camera.pan.x) * camera.zoom,
      (link.target.y + camera.pan.y) * camera.zoom
    );

    ctx.stroke();

    // ctx.fillStyle = 'red';

    // let angle = Math.atan(
    //   ((link.target.y + camera.pan.y) * camera.zoom -
    //     (link.source.y + camera.pan.y) * camera.zoom) /
    //     ((link.target.x + camera.pan.x) * camera.zoom -
    //       (link.source.x + camera.pan.x) * camera.zoom)
    // );

    // angle +=
    //   (((link.target.x + camera.pan.x) * camera.zoom > (link.source.x + camera.pan.x) * camera.zoom
    //     ? 90
    //     : -90) *
    //     Math.PI) /
    //   180;

    // drawArrow({
    //   angle,
    //   ctx: ctx,
    //   toX: (link.target.x + camera.pan.x) * camera.zoom,
    //   toY: (link.target.y + camera.pan.y) * camera.zoom
    // });
  }, [camera, ctx, link.source.x, link.source.y, link.target.x, link.target.y]);

  return null;
};

LinkCanvas.displayName = 'LinkCanvas';
