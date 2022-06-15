import {
  FC,
  forwardRef,
  LegacyRef,
  memo,
  MouseEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEventHandler
} from 'react';

import { LinkCanvas, NodeCanvas } from './components';
import { useForceGraph } from './hooks';
import { CanvasCamera, ForcedGraphProps } from './types';

interface CanvasProps {
  height: number;
  onMouseDown?: MouseEventHandler<HTMLCanvasElement>;
  onMouseMove?: MouseEventHandler<HTMLCanvasElement>;
  onMouseUp?: MouseEventHandler<HTMLCanvasElement>;
  onWheel?: WheelEventHandler<HTMLCanvasElement>;
  ref: RefObject<HTMLCanvasElement>;
  width: number;
}

const Canvas: FC<CanvasProps> = memo(
  forwardRef(({ children, height, onMouseDown, onMouseMove, onMouseUp, onWheel, width }, ref) => {
    return (
      <canvas
        height={width}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onWheel={onWheel}
        ref={ref as LegacyRef<HTMLCanvasElement>}
        width={height}
      >
        {children}
      </canvas>
    );
  })
);

export const ForcedGraphCanvas: FC<ForcedGraphProps> = memo(
  ({
    alpha,
    centerX,
    centerY,
    chargeStrength,
    collideStrength,
    className,
    forceXStrength,
    forceYStrength,
    graph,
    height,
    nodeDistance,
    panStep,
    width,
    zoomInStep,
    zoomOutStep
  }) => {
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    const { animatedNodes, movedNode, setMovedNode, stopNodeMove } = useForceGraph({
      alpha,
      centerX,
      centerY,
      chargeStrength,
      collideStrength,
      forceXStrength,
      forceYStrength,
      graph,
      nodeDistance,
      panStep,
      zoomInStep,
      zoomOutStep
    });

    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mouseDownEvent, setMouseDownEvent] = useState({
      clientX: 0,
      clientY: 0
    });

    const [camera, setCamera] = useState<CanvasCamera>({
      pan: { x: 0, y: 0 },
      zoom: 1
    });

    const onCanvasMouseDown: MouseEventHandler = useCallback(({ clientX, clientY }) => {
      if (!canvasRef.current) {
        return;
      }

      const { x, y } = canvasRef.current.getBoundingClientRect();

      setMouseDownEvent({
        clientX: clientX - x,
        clientY: clientY - y
      });
    }, []);

    const onMouseMoveHandler: MouseEventHandler<HTMLCanvasElement> = useCallback(
      ({ clientX, clientY }) => {
        if (!movedNode || !canvasRef.current) {
          return;
        }

        const { x, y } = canvasRef.current.getBoundingClientRect();

        movedNode.x = (clientX - x) / camera.zoom - camera.pan.x; //+ camera.pan.x;
        movedNode.y = (clientY - y) / camera.zoom - camera.pan.y; //+ camera.pan.y;
      },
      [camera, movedNode]
    );

    const onWheelHandler: WheelEventHandler<HTMLCanvasElement> = useCallback(
      (event) => {
        if (!ctx || !canvasRef.current) {
          return;
        }
        const { altKey, clientX, clientY, deltaY, shiftKey } = event;

        const panX = clientX - width / 2;
        const panY = clientY - height / 2;

        const toNorth = deltaY < 0;

        if (altKey && toNorth) {
          setCamera((currentCamera) => ({
            pan: {
              x: currentCamera.pan.x - panX / (currentCamera.zoom * zoomInStep),
              y: currentCamera.pan.y - panY / (currentCamera.zoom * zoomInStep)
            },
            zoom: currentCamera.zoom * zoomInStep
          }));
        } else if (altKey && !toNorth) {
          setCamera((currentCamera) => ({
            pan: {
              x: currentCamera.pan.x + panX / (currentCamera.zoom * zoomOutStep),
              y: currentCamera.pan.y + panY / (currentCamera.zoom * zoomOutStep)
            },
            zoom: currentCamera.zoom * zoomOutStep
          }));
        } else if (toNorth && !shiftKey) {
          setCamera((currentCamera) => ({
            ...currentCamera,
            pan: {
              ...currentCamera.pan,
              y: currentCamera.pan.y + panStep
            }
          }));
        } else if (toNorth && shiftKey) {
          setCamera((currentCamera) => ({
            ...currentCamera,
            pan: {
              ...currentCamera.pan,
              x: currentCamera.pan.x + panStep
            }
          }));
        } else if (!toNorth && !shiftKey) {
          setCamera((currentCamera) => ({
            ...currentCamera,
            pan: {
              ...currentCamera.pan,
              y: currentCamera.pan.y - panStep
            }
          }));
        } else {
          setCamera((currentCamera) => ({
            ...currentCamera,
            pan: {
              ...currentCamera.pan,
              x: currentCamera.pan.x - panStep
            }
          }));
        }
      },
      [ctx, height, panStep, width, zoomInStep, zoomOutStep]
    );

    useEffect(() => {
      setCtx(canvasRef?.current?.getContext('2d') ?? null);
    }, []);

    useEffect(() => {
      return () => {
        ctx?.clearRect(0, 0, width, height);
        ctx?.beginPath();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [animatedNodes, camera]);

    return (
      <div className={className} onMouseLeave={stopNodeMove}>
        <Canvas
          height={width}
          onMouseDown={onCanvasMouseDown}
          onMouseMove={onMouseMoveHandler}
          onMouseUp={stopNodeMove}
          onWheel={onWheelHandler}
          ref={canvasRef}
          width={height}
        >
          {(graph.links as any).map((link: any, index: number) => (
            <LinkCanvas
              camera={camera}
              ctx={ctx}
              key={link.source.id && link.target.id ? `${link.source.id}-${link.target.id}` : index}
              link={link}
            />
          ))}
          {animatedNodes.map((node) => (
            <NodeCanvas
              camera={camera}
              ctx={ctx}
              key={node.id}
              mouseDownEvent={mouseDownEvent}
              node={node}
              setMovedNode={setMovedNode}
            />
          ))}
        </Canvas>
      </div>
    );
  }
);

ForcedGraphCanvas.displayName = 'ForcedGraphCanvas';
