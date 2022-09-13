import { Meta, Story } from '@storybook/react';
import { FC, StrictMode, useState } from 'react';

import { Button } from '@ui';

import { FormStorageProvider } from '../components';
import { StepOne, StepTwo } from './components';

export default {
  title: 'Demo/Form-Storage-Provider'
} as Meta;

const Template: Story<FC> = () => {
  const [step, setStep] = useState(1);

  return (
    <StrictMode>
      <div>
        <Button dataTest="set-step-1" onClick={() => setStep(1)} text="Step 1" />
        <Button dataTest="set-step-2" onClick={() => setStep(2)} text="Step 2" />
      </div>
      <FormStorageProvider>
        {step === 1 ? <StepOne /> : null}
        {step === 2 ? <StepTwo /> : null}
      </FormStorageProvider>
    </StrictMode>
  );
};

export const FormDemo = Template.bind({});
