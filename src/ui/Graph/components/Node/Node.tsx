import { Dispatch, FC, SetStateAction } from 'react';

import { GraphNode } from '../../types';

interface NodeProps {
  node: GraphNode;
  setMovedNode: Dispatch<SetStateAction<GraphNode | null>>;
}

export const Node: FC<NodeProps> = ({ node, setMovedNode }) => {
  return (
    <g>
      <text fontSize={12} x={(node.x ?? 0) + 24} y={(node.y ?? 0) + 4}>
        {node.id}
      </text>
      <circle
        cx={node.x}
        cy={node.y}
        fill="blue"
        r={20}
        stroke="transparent"
        onMouseDown={() => setMovedNode(node)}
      />
    </g>
  );
};

Node.displayName = 'Node';
