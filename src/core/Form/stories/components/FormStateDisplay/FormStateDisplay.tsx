import { memo, useState } from 'react';
import { createPortal } from 'react-dom';

import { useFormRoot } from '@core/Form/providers';
import { Button, Text } from '@ui';

import styles from './FormStateDisplay.scss';

const FormStateDisplay = () => {
  const [inputValue, setInputValue] = useState('');
  const [fieldIdInput, setFieldIdInput] = useState('');
  const {
    errors,
    formData,
    methods: { focusField, scrollFieldIntoView, setFieldsValue }
  } = useFormRoot();

  const element = document.getElementById('form-state-display');

  return element
    ? createPortal(
        <div>
          {Object.keys(errors).length ? (
            <div style={{ color: '#b01717' }}>
              <h3>Errors:</h3>
              <pre data-test="form-errors">{JSON.stringify(errors, null, 2)}</pre>
              <div style={{ color: 'initial' }}>
                <h4>Scroll into view:</h4>
                {Object.keys(errors).map((fieldId) => {
                  return (
                    <Button
                      className={styles.Button}
                      dataTest={`scroll-into-view-${fieldId}`}
                      key={fieldId}
                      onClick={() => scrollFieldIntoView(fieldId)}
                      text={fieldId}
                    />
                  );
                })}
                <h4>Focus:</h4>
                {Object.keys(errors).map((fieldId) => {
                  return (
                    <Button
                      className={styles.Button}
                      dataTest={`focus-${fieldId}`}
                      key={fieldId}
                      onClick={() => focusField(fieldId)}
                      text={fieldId}
                    />
                  );
                })}
                <h4>Set value:</h4>
                <div>
                  <label htmlFor="field-value">Value:</label>
                  <input
                    id="field-value"
                    onChange={(event) => setInputValue(event.target.value)}
                    value={inputValue}
                  />
                </div>
                <div>
                  <label htmlFor="field-id">Field id:</label>
                  <input
                    id="field-id"
                    onChange={(event) => setFieldIdInput(event.target.value)}
                    value={fieldIdInput}
                  />
                  <Button
                    className={styles.Button}
                    dataTest={`set-field-value`}
                    onClick={() => setFieldsValue({ [fieldIdInput]: inputValue })}
                    text="Set"
                  />
                </div>
                {Object.keys(errors).map((fieldId) => {
                  return (
                    <Button
                      className={styles.Button}
                      dataTest={`set-field-value-${fieldId}`}
                      key={fieldId}
                      onClick={() => setFieldsValue({ [fieldId]: inputValue })}
                      text={fieldId}
                    />
                  );
                })}
              </div>
            </div>
          ) : null}

          <div>
            <h3>Form Data:</h3>
            <pre data-test="form-state">{JSON.stringify(formData, null, 2)}</pre>
          </div>

          <Button
            className={styles.Button}
            dataTest={`set-multiple-field-value`}
            onClick={() => setFieldsValue({ ['filed_0']: 'John Doe', ['filed_1']: 'Mary Poppins' })}
            text="Set Multiple"
          />
          <Text
            dataTest="field-0"
            disabled={false}
            id="field-0"
            initialValue="John"
            name="filed_0"
          />
          <Text
            dataTest="field-1"
            disabled={false}
            id="field-1"
            initialValue="Mary"
            name="filed_1"
          />
        </div>,
        element
      )
    : null;
};

export default memo(FormStateDisplay);
