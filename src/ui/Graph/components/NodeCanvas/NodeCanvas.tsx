import { Dispatch, FC, memo, SetStateAction, useEffect } from 'react';

import { CanvasCamera, GraphNode } from '../../types';

interface NodeProps {
  camera: CanvasCamera;
  ctx: CanvasRenderingContext2D | null;
  mouseDownEvent: { clientX: number; clientY: number };
  node: GraphNode;
  setMovedNode: Dispatch<SetStateAction<GraphNode | null>>;
}

export const NodeCanvas: FC<NodeProps> = memo(
  ({ camera, ctx, mouseDownEvent, node, setMovedNode }) => {
    useEffect(() => {
      if (!ctx) {
        return;
      }
      // https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes
      const circle = new Path2D();

      const x = ((node.x || 0) + camera.pan.x) * camera.zoom;

      const y = ((node.y || 0) + camera.pan.y) * camera.zoom;

      circle.arc(x, y, 20 * camera.zoom, 0, 2 * Math.PI);

      ctx.fillStyle = 'blue';
      ctx.fill(circle);

      ctx.fillStyle = 'black';
      ctx.fillText(node.id, x + 20 * camera.zoom + 10, y);
    }, [camera, ctx, node.id, node.x, node.y]);

    useEffect(() => {
      const distance = Math.sqrt(
        (((node.x || 0) + camera.pan.x) * camera.zoom - mouseDownEvent.clientX) ** 2 +
          (((node.y || 0) + camera.pan.y) * camera.zoom - mouseDownEvent.clientY) ** 2
      );

      if (distance <= 20) {
        setMovedNode(node);

        console.log('movedNode', node.id);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mouseDownEvent]);

    return null;
  },
  (prev, next) => {
    return prev.node.x !== next.node.x || prev.node.y !== next.node.y;
  }
);

NodeCanvas.displayName = 'NodeCanvas';
