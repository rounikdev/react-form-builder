import {
  MouseEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
  WheelEventHandler
} from 'react';

import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
  Simulation
} from 'd3-force';

import { GraphNode, UseForceGraphProps } from '../types';

// https://reactfordataviz.com/articles/force-directed-graphs-with-react-and-d3v7/
// https://www.petercollingridge.co.uk/tutorials/svg/interactive/pan-and-zoom/

export const useForceGraph = ({
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
}: UseForceGraphProps) => {
  const [animatedNodes, setAnimatedNodes] = useState<GraphNode[]>([]);

  const [movedNode, setMovedNode] = useState<GraphNode | null>(null);

  const [transformMatrix, setTransformMatrix] = useState([1, 0, 0, 1, centerX, centerY]);

  const simulationRef = useRef<Simulation<GraphNode, undefined> | null>(null);

  const svgRef = useRef<SVGSVGElement | null>(null);

  const pan = useCallback((dx: number, dy: number) => {
    setTransformMatrix((currentTransformMatrix) => {
      const newTransformMatrix = [...currentTransformMatrix];

      newTransformMatrix[4] += dx;

      newTransformMatrix[5] += dy;

      return newTransformMatrix;
    });
  }, []);

  const zoom = useCallback(
    (scale: number) => {
      setTransformMatrix((currentTransformMatrix) => {
        const newTransformMatrix = [...currentTransformMatrix];

        for (let i = 0; i < 4; i++) {
          newTransformMatrix[i] *= scale;
        }

        newTransformMatrix[4] += (1 - scale) * centerX;

        newTransformMatrix[5] += (1 - scale) * centerY;

        return newTransformMatrix;
      });
    },
    [centerX, centerY]
  );

  const stopNodeMove = useCallback(() => {
    setMovedNode(null);
  }, []);

  const onMouseMoveHandler: MouseEventHandler<SVGSVGElement> = useCallback(
    (event) => {
      if (!movedNode) {
        return;
      }

      const CTM = svgRef.current?.getScreenCTM();

      const A = CTM?.e ?? 0;

      const B = transformMatrix[0];

      const C = CTM?.f ?? 0;

      const D = transformMatrix[3];

      movedNode.x = (event.clientX - A) / B - transformMatrix[4] / B;
      movedNode.y = (event.clientY - C) / D - transformMatrix[5] / D;
    },
    [movedNode, transformMatrix]
  );

  const onWheelHandler: WheelEventHandler<SVGSVGElement> = useCallback(
    (event) => {
      const { altKey, deltaY, shiftKey } = event;

      const toNorth = deltaY < 0;

      if (altKey && toNorth) {
        zoom(zoomInStep);
      } else if (altKey && !toNorth) {
        zoom(zoomOutStep);
      } else if (toNorth && !shiftKey) {
        pan(0, panStep);
      } else if (toNorth && shiftKey) {
        pan(panStep, 0);
      } else if (!toNorth && !shiftKey) {
        pan(0, -panStep);
      } else {
        pan(-panStep, 0);
      }
    },
    [pan, panStep, zoom, zoomInStep, zoomOutStep]
  );

  useEffect(() => {
    if (movedNode) {
      simulationRef.current?.alpha(alpha).restart();
    }
  }, [alpha, movedNode]);

  useEffect(() => {
    const simulation = forceSimulation<GraphNode>()
      .force('x', forceX(forceXStrength))
      .force('y', forceY(forceYStrength))
      .force('charge', forceManyBody().strength(chargeStrength))
      .force('collision', forceCollide(collideStrength));

    simulation.nodes([...graph.nodes]);

    simulation.force(
      'link',
      forceLink(graph.links)
        .id((node) => (node as GraphNode).id)
        .distance(nodeDistance)
    );

    simulation.on('tick', () => {
      setAnimatedNodes([...simulation.nodes()]);
    });

    simulation.alpha(alpha).restart();

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
    };
  }, [alpha, chargeStrength, collideStrength, forceXStrength, forceYStrength, graph, nodeDistance]);

  return {
    animatedNodes,
    movedNode,
    onMouseMoveHandler,
    onWheelHandler,
    setMovedNode,
    stopNodeMove,
    svgRef,
    transformMatrix
  };
};
