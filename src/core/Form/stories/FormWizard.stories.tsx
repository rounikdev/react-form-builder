import { Meta, Story } from '@storybook/react';
import { FC, StrictMode, useState } from 'react';

import { FormRoot } from '../components';
import {
  WizardStepID,
  WizardStepIndicator,
  WizardStepName,
  WizardStepReview,
  WizardStepSupplierA,
  WizardStepSupplierB,
  WizardStepSupplierBUrl,
  WizardStepType
} from './components';

import styles from './FormStories.scss';

export default {
  title: 'Demo/FormWizard'
} as Meta;

const Template: Story<FC> = () => {
  const [currentStep, setCurrentStep] = useState(WizardStepID.NAME);

  const wizardStepProps = { currentStep, setStep: setCurrentStep };

  return (
    <StrictMode>
      <section className={styles.Container}>
        <div className={styles.FormContainer}>
          <FormRoot
            className={styles.Form}
            dataTest="item"
            onSubmit={({ rootMethods: { injectErrors } }) => {
              setTimeout(() => {
                /**
                 * Set errors returned from the server.
                 * THey will be persisted until the corresponding
                 * field's value gets changed.
                 */
                injectErrors({
                  name: { errors: [{ text: 'Such item exists' }], override: true },
                  type: { errors: [{ text: 'Are you sure' }], override: true }
                });
              }, 500);
            }}
          >
            <div>
              <WizardStepIndicator {...wizardStepProps} />
              <div>
                <WizardStepName {...wizardStepProps} />
                <WizardStepType {...wizardStepProps} />
                <WizardStepSupplierA {...wizardStepProps} />
                <WizardStepSupplierB {...wizardStepProps} />
                <WizardStepSupplierBUrl {...wizardStepProps} />
                <WizardStepReview {...wizardStepProps} />
              </div>
            </div>
          </FormRoot>
        </div>
      </section>
    </StrictMode>
  );
};

export const FormWizard = Template.bind({});
