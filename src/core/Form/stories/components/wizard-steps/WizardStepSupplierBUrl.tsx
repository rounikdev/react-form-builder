import { FC, memo } from 'react';

import { ConditionalFields, FormUser } from '@core';
import { Button, Text } from '@ui';

import { SupplierType, WizardStepID, WizardStepProp } from './wizard-step.types';

export const WizardStepSupplierBUrl: FC<WizardStepProp<WizardStepID>> = memo(
  ({ currentStep, setStep }) => {
    return (
      <>
        <ConditionalFields
          condition={() => currentStep === WizardStepID.SUPPLIER_B_URL}
          hidden={(formData) => formData.type === SupplierType.CUSTOM}
        >
          <h1>Supplier Custom URL</h1>
          <Text
            dataTest="supplier-url"
            id="supplier-url"
            label="Supplier URL"
            name="supplierUrl"
            required
          />
          <FormUser>
            {() => {
              return (
                <div>
                  <Button
                    dataTest="back"
                    onClick={() => setStep && setStep(WizardStepID.SUPPLIER_B)}
                    text="Back"
                  />
                  <Button
                    dataTest="next"
                    onClick={() => setStep && setStep(WizardStepID.REVIEW)}
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

WizardStepSupplierBUrl.displayName = 'WizardStepSupplierBUrl';
