import { FC, StrictMode } from 'react';
import { ComponentMeta, ComponentStory } from '@storybook/react';

import { ForcedGraph } from '../ForcedGraph';
import { ForcedGraphCanvas } from '../ForcedGraphCanvas';

import styles from './Graph.stories.scss';

import { bankingGraph } from './banking-graph';

import { mapOntology } from './utils';

export default {
  title: 'Lab/ForcedGraph',
  component: ForcedGraph
} as ComponentMeta<typeof ForcedGraph>;

const Template: ComponentStory<FC> = () => (
  <StrictMode>
    <ForcedGraph
      alpha={0.3}
      centerX={200}
      centerY={200}
      chargeStrength={-1000}
      className={styles.Container}
      collideStrength={10}
      forceXStrength={150}
      forceYStrength={150}
      graph={bankingGraph}
      height={800}
      nodeDistance={1000}
      panStep={25}
      zoomInStep={1.2}
      zoomOutStep={0.8}
      width={800}
    />
  </StrictMode>
);

export const ForcedGraphDemo = Template.bind({});

ForcedGraphDemo.args = {};
