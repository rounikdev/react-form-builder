import { FC, memo } from 'react';

import { ConditionalFields, FormUser } from '@core';
import { Button } from '@ui';

import { SupplierType, WizardStepID, WizardStepProp } from './wizard-step.types';

export const WizardStepReview: FC<WizardStepProp<WizardStepID>> = memo(
  ({ currentStep, setStep }) => {
    return (
      <>
        <ConditionalFields condition={() => currentStep === WizardStepID.REVIEW} hidden>
          <FormUser>
            {({ formRootContext }) => {
              return (
                <div>
                  <pre>{JSON.stringify(formRootContext.formData, null, 2)}</pre>
                  <Button
                    dataTest="back"
                    onClick={() => {
                      if (setStep) {
                        if (formRootContext.formData.type === SupplierType.BASIC) {
                          setStep(WizardStepID.SUPPLIER_A);
                        } else {
                          setStep(WizardStepID.SUPPLIER_B);
                        }
                      }
                    }}
                    text="Back"
                  />
                  <Button
                    dataTest="submit"
                    onClick={() => console.log(formRootContext.formData)}
                    type="submit"
                    text="Submit"
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

WizardStepReview.displayName = 'WizardStepReview';
