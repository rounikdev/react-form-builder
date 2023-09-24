import { FC, memo } from 'react';

import { ConditionalFields, FormUser } from '@core';
import { Autocomplete, Button } from '@ui';
import { Option } from '@ui/inputs/Autocomplete';

import { SupplierType, WizardStepID, WizardStepProp } from './wizard-step.types';

import styles from '../../FormStories.scss';

export const options = [
  {
    id: 'john',
    label: 'John'
  },
  {
    id: 'mike',
    label: 'Mike'
  },
  {
    id: 'maria',
    label: 'Maria'
  }
];

export const WizardStepSupplierA: FC<WizardStepProp<WizardStepID>> = memo(
  ({ currentStep, setStep }) => {
    return (
      <>
        <ConditionalFields
          condition={() => currentStep === WizardStepID.SUPPLIER_A}
          hidden={(formData) => formData.type === SupplierType.BASIC}
        >
          <h1>Supplier Basic</h1>
          <Autocomplete
            autocomplete
            className={styles.Field}
            dataTest="supplier"
            extractId={(item) => item?.id ?? ''}
            extractLabel={(item) => item.label}
            id="supplier"
            label="Supplier"
            list={options}
            name="supplier"
            renderOption={({ item, ref }) => (
              <Option dataTest={item.id} id={item.id} key={item.id} ref={ref} text={item.label} />
            )}
          />
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

WizardStepSupplierA.displayName = 'WizardStepSupplierA';
