import { memo, useState } from 'react';
import { createPortal } from 'react-dom';

import { useForm } from '@components/Form/hooks';
import { useFormRoot } from '@components/Form/providers';

const FormStateDisplay = () => {
  const [inputValue, setInputValue] = useState('');
  const [fieldIdInput, setFieldIdInput] = useState('');
  const { errors, formData } = useFormRoot();
  const {
    methods: { focusField, scrollFieldIntoView, setFieldValue }
  } = useForm();

  const element = document.getElementById('form-state-display');

  return element
    ? createPortal(
        <div>
          <div style={{ color: 'red' }}>
            <h3>Errors:</h3>
            <pre>{JSON.stringify(errors, null, 2)}</pre>
            <div style={{ color: 'initial' }}>
              <h4>Scroll into view:</h4>
              {Object.keys(errors).map((fieldId) => {
                return (
                  <button key={fieldId} onClick={() => scrollFieldIntoView(fieldId)}>
                    {fieldId}
                  </button>
                );
              })}
              <h4>Focus:</h4>
              {Object.keys(errors).map((fieldId) => {
                return (
                  <button key={fieldId} onClick={() => focusField(fieldId)}>
                    {fieldId}
                  </button>
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
                <button onClick={() => setFieldValue({ id: fieldIdInput, value: inputValue })}>
                  Set
                </button>
              </div>
              {Object.keys(errors).map((fieldId) => {
                return (
                  <button
                    key={fieldId}
                    onClick={() => setFieldValue({ id: fieldId, value: inputValue })}
                  >
                    {fieldId}
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <h3>Form Data:</h3>
            <pre>{JSON.stringify(formData, null, 2)}</pre>
          </div>
        </div>,
        element
      )
    : null;
};

export default memo(FormStateDisplay);
