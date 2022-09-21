import { Meta, Story } from '@storybook/react';
import { FC, StrictMode, useState } from 'react';

import { Button, Text } from '@ui';

import { FormRoot } from '../components';

import styles from './FormStories.scss';

export default {
  title: 'Demo/UseFieldDependency'
} as Meta;

const Template: Story<FC> = () => {
  const [initialFirstName, setInitialFirstName] = useState('');

  return (
    <StrictMode>
      <FormRoot className={styles.FormUseFieldDependency} dataTest="users">
        <Text
          dataTest="first-name"
          disabled={false}
          id="first-name"
          initialValue={initialFirstName}
          label="First Name"
          name="firstName"
        />
        <Text
          dataTest="last-name"
          dependencyExtractor={(formData) => ({
            firstName: formData?.firstName,
            lastName: formData?.lastName || ''
          })}
          disabled={({ firstName }) => firstName === 'Jim'}
          id="last-name"
          initialValue={({ firstName, lastName }) => (firstName === 'John' ? 'Doe' : lastName)}
          label={({ firstName }) => (firstName === 'John' ? 'Special Name' : 'Last Name')}
          name="lastName"
        />
        <Button
          dataTest="update-value"
          onClick={() => setInitialFirstName((current) => (current === 'John' ? 'Mike' : 'John'))}
          text="Update value"
        />
      </FormRoot>
    </StrictMode>
  );
};

export const UseFieldDependency = Template.bind({});
