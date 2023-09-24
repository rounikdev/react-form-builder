import { FC, memo } from 'react';

import { ConditionalFields, FormUser } from '@core';
import { Button, Text } from '@ui';

import { WizardStepID, WizardStepProp } from './wizard-step.types';

export const WizardStepName: FC<WizardStepProp<WizardStepID>> = memo(({ currentStep, setStep }) => {
  return (
    <>
      <ConditionalFields condition={() => currentStep === WizardStepID.NAME} hidden>
        <Text dataTest="name" id="name" label="Name" name="name" required />
        <FormUser>
          {({ formRootContext: { errors, formData } }) => {
            return (
              <div>
                <Button
                  dataTest="next"
                  disabled={!formData.name || !!errors.name?.length}
                  onClick={() => setStep && setStep(WizardStepID.TYPE)}
                  text="Next"
                />
              </div>
            );
          }}
        </FormUser>
      </ConditionalFields>
    </>
  );
});

WizardStepName.displayName = 'WizardStepName';
