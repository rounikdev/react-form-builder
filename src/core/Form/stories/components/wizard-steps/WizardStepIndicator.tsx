import { FC } from 'react';

import { FormUser } from '@core/Form/components';
import { GlobalModel } from '@services';

import { SupplierType, WizardStepID, WizardStepProp } from './wizard-step.types';

import styles from '../../FormStories.scss';

type WizardStepIndicatorProps = WizardStepProp<WizardStepID>;

export const WizardStepIndicator: FC<WizardStepIndicatorProps> = ({ currentStep, setStep }) => {
  return (
    <FormUser>
      {({ formRootContext }) => {
        return (
          <div className={styles.StepIndicator}>
            <span
              className={GlobalModel.classer([
                styles.StepIndicatorItem,
                currentStep === WizardStepID.NAME && styles.Selected
              ])}
              onClick={() => setStep && setStep(WizardStepID.NAME)}
            >
              <div>
                <span className={styles.StepNumber}>1</span>Name
              </div>
              <span className={styles.ItemValue}>
                {currentStep !== WizardStepID.NAME && formRootContext.formData.name}
              </span>
            </span>
            <span
              className={GlobalModel.classer([
                styles.StepIndicatorItem,
                currentStep === WizardStepID.TYPE && styles.Selected
              ])}
              onClick={() => setStep && setStep(WizardStepID.TYPE)}
            >
              <div>
                <span className={styles.StepNumber}>2</span>Type
              </div>
              <span className={styles.ItemValue}>
                {currentStep !== WizardStepID.TYPE && formRootContext.formData.type}
              </span>
            </span>
            <span
              className={GlobalModel.classer([
                styles.StepIndicatorItem,
                (currentStep === WizardStepID.SUPPLIER_A ||
                  currentStep === WizardStepID.SUPPLIER_B ||
                  currentStep === WizardStepID.SUPPLIER_B_URL) &&
                  styles.Selected
              ])}
              onClick={() => {
                if (Boolean(formRootContext.formData.supplier) && setStep) {
                  setStep(
                    formRootContext.formData.type === SupplierType.BASIC
                      ? WizardStepID.SUPPLIER_A
                      : WizardStepID.SUPPLIER_B
                  );
                }
              }}
            >
              <div>
                <span className={styles.StepNumber}>3</span>Supplier
              </div>
            </span>
            <span
              className={GlobalModel.classer([
                styles.StepIndicatorItem,
                currentStep === WizardStepID.REVIEW && styles.Selected
              ])}
              onClick={() => {
                if (
                  Boolean(formRootContext.formData.name) &&
                  Boolean(formRootContext.formData.type) &&
                  Boolean(formRootContext.formData.supplier) &&
                  setStep
                ) {
                  setStep(WizardStepID.REVIEW);
                }
              }}
            >
              <div>
                <span className={styles.StepNumber}>4</span>Review
              </div>
            </span>
          </div>
        );
      }}
    </FormUser>
  );
};

WizardStepIndicator.displayName = 'WizardStepIndicator';
