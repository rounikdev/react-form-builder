import { ComponentStory, ComponentMeta } from '@storybook/react';

//import { BaseCSS } from './BaseCSS';

const Cmp = () => <div>Hieefe</div>;

export default {
  component: Cmp,
  title: 'Components/BaseCSS'
} as ComponentMeta<typeof Cmp>;

const Template: ComponentStory<typeof Cmp> = (): JSX.Element => {
  return (
    <>
      <h1>Hi</h1>
      {/* <Cmp /> */}
      {/* <BaseCSS /> */}
    </>
  );
};

export const Normalize = Template.bind({});
