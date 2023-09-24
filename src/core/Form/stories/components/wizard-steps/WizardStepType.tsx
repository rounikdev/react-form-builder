import { FC, memo } from 'react';

import { ConditionalFields, FormUser } from '@core';
import { Button, RadioGroup } from '@ui';

import { SupplierType, WizardStepID, WizardStepProp } from './wizard-step.types';

const options = [
  {
    label: 'Basic',
    value: SupplierType.BASIC
  },
  { label: 'Custom', value: SupplierType.CUSTOM }
];

export const WizardStepType: FC<WizardStepProp<WizardStepID>> = memo(({ currentStep, setStep }) => {
  return (
    <>
      <ConditionalFields condition={() => currentStep === WizardStepID.TYPE} hidden>
        <RadioGroup
          dataTest="type"
          groupLabel="Select item type"
          id="type"
          name="type"
          options={options}
          required
        />
        <FormUser>
          {({ formRootContext }) => {
            return (
              <div>
                <Button
                  dataTest="back"
                  onClick={() => setStep && setStep(WizardStepID.NAME)}
                  text="Back"
                />
                <Button
                  dataTest="next"
                  disabled={
                    !formRootContext.formData.type || !!formRootContext.errors?.type?.length
                  }
                  onClick={() => {
                    if (setStep) {
                      if (formRootContext.formData.type === SupplierType.BASIC) {
                        setStep(WizardStepID.SUPPLIER_A);
                      } else {
                        setStep(WizardStepID.SUPPLIER_B);
                      }
                    }
                  }}
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

WizardStepType.displayName = 'WizardStepType';
