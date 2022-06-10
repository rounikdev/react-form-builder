import { FC, memo } from 'react';

import { Link, Node } from './components';
import { useForceGraph } from './hooks';
import { ForcedGraphProps } from './types';

export const ForcedGraph: FC<ForcedGraphProps> = memo(
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
    const {
      animatedNodes,
      onMouseMoveHandler,
      onWheelHandler,
      setMovedNode,
      stopNodeMove,
      svgRef,
      transformMatrix
    } = useForceGraph({
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

    return (
      <div className={className} onMouseLeave={stopNodeMove}>
        <svg
          height={height}
          onMouseMove={onMouseMoveHandler}
          onMouseUp={stopNodeMove}
          onWheel={onWheelHandler}
          ref={svgRef}
          width={width}
        >
          <g transform={`matrix(${transformMatrix.join(' ')})`}>
            <g>
              {(graph.links as any).map((link: any, index: number) => (
                <Link
                  key={
                    link.source.id && link.target.id ? `${link.source.id}-${link.target.id}` : index
                  }
                  link={link}
                />
              ))}
            </g>
            <g>
              {animatedNodes.map((node) => (
                <Node key={node.id} node={node} setMovedNode={setMovedNode} />
              ))}
            </g>
          </g>
        </svg>
      </div>
    );
  }
);

ForcedGraph.displayName = 'ForcedGraph';
