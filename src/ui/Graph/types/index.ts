import { SimulationNodeDatum } from 'd3-force';

export interface Node {
  id: string;
}

export interface GraphNode extends SimulationNodeDatum, Node {}

export interface Link {
  source: string;
  target: string;
}

export interface Graph {
  nodes: Node[];
  links: Link[];
}

export interface UseForceGraphProps {
  alpha: number;
  centerX: number;
  centerY: number;
  chargeStrength: number;
  collideStrength: number;
  forceXStrength: number;
  forceYStrength: number;
  graph: Graph;
  nodeDistance: number;
  panStep: number;
  zoomInStep: number;
  zoomOutStep: number;
}

export interface ForcedGraphProps extends UseForceGraphProps {
  className?: string;
  height: number;
  width: number;
}
