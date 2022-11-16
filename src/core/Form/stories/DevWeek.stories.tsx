import { Meta, Story } from '@storybook/react';
import { FC, StrictMode } from 'react';

import styles from './FormStories.scss';

export default {
  title: 'Demo/DevWeek-11-2022'
} as Meta;

const Template: Story<FC> = () => {
  return (
    <StrictMode>
      <section className={styles.Container}>
        <h1>Hello DevWeek!!!</h1>
      </section>
    </StrictMode>
  );
};

export const FormDemo = Template.bind({});
