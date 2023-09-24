import { FC, memo } from 'react';

import { ConditionalFields, FormUser } from '@core';
import { Button, Text } from '@ui';

import { SupplierType, WizardStepID, WizardStepProp } from './wizard-step.types';

export const WizardStepSupplierB: FC<WizardStepProp<WizardStepID>> = memo(
  ({ currentStep, setStep }) => {
    return (
      <>
        <ConditionalFields
          condition={() => currentStep === WizardStepID.SUPPLIER_B}
          hidden={(formData) => formData.type === SupplierType.CUSTOM}
        >
          <h1>Supplier Custom</h1>
          <Text dataTest="supplier" id="supplier" label="Supplier" name="supplier" required />
          <FormUser>
            {() => {
              return (
                <div>
                  <Button
                    dataTest="back"
                    onClick={() => setStep && setStep(WizardStepID.TYPE)}
                    text="Back"
                  />
                  <Button
                    dataTest="next"
                    onClick={() => setStep && setStep(WizardStepID.SUPPLIER_B_URL)}
                    text="Next"
                  />
                </div>
              );
            }}
          </FormUser>
        </ConditionalFields>
      </>
    );
  }
);

WizardStepSupplierB.displayName = 'WizardStepSupplierB';
