import { FC, memo, useMemo } from 'react';

import { ConditionalFields, FormObject, FormRoot, FormUser, useFormStorage } from '@core';
import { ValidatorModel } from '@services';
import { Button, Checkbox, Text } from '@ui';

const formId = 'stepTwo';

export const StepTwo: FC = memo(() => {
  const { resetFormData, setFormData, state } = useFormStorage();

  const initialState = useMemo(() => {
    return state[formId]?.value ?? {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state[formId]?.value]);

  return (
    <FormRoot
      dataTest="user-details"
      initialResetState={state[formId]?.resetState}
      onChange={(formData) => {
        console.log(formData);
        setFormData({ formData, formId });
      }}
      onReset={() => {
        console.log('reset step two');
        resetFormData({ formId });
      }}
      usesStorage
    >
      <Checkbox
        dataTest="has-details"
        id="has-details"
        initialValue={initialState.hasDetails}
        label="Has details"
        name="hasDetails"
      />
      <ConditionalFields condition={(formData) => formData.hasDetails}>
        <FormObject name="details">
          <Text
            dependencyExtractor={(formData) => formData.hasDetails}
            dataTest="address"
            id="address"
            initialValue={(hasDetails) =>
              hasDetails ? initialState?.details?.address ?? 'Sofia' : ''
            }
            label="Address"
            name="address"
            required={(hasDetails) => hasDetails}
            validator={ValidatorModel.requiredValidator}
          />
          <Text
            dependencyExtractor={(formData) => ({
              address: formData?.details?.address ?? ''
            })}
            dataTest="country"
            disabled={({ address }) => address === 'Varna'}
            id="country"
            initialValue={({ address }) => {
              return address === 'Varna' ? 'Bulgaria' : initialState?.details?.country ?? '';
            }}
            label="Country"
            name="country"
            required
            validator={ValidatorModel.requiredValidator}
          />
          <Checkbox
            dataTest="likes-reading"
            id="likes-reading"
            initialValue={initialState?.details?.likesReading ?? true}
            label="Likes reading"
            name="likesReading"
          />
        </FormObject>
      </ConditionalFields>
      <FormUser>
        {({ formRootContext: { methods } }) => {
          return (
            <div>
              <Button dataTest="reset" onClick={() => methods.reset({})} text="Reset" />
            </div>
          );
        }}
      </FormUser>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </FormRoot>
  );
});

StepTwo.displayName = 'StepTwo';
