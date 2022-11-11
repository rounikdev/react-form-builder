import { memo } from 'react';
import { createPortal } from 'react-dom';

import { useFormRoot } from '@core/Form/providers';

const FormStateDisplaySimple = () => {
  const { errors, formData } = useFormRoot();

  const element = document.getElementById('form-state-display');

  return element
    ? createPortal(
        <div>
          {Object.keys(errors).length ? (
            <div style={{ color: '#b01717' }}>
              <h3>Errors:</h3>
              <pre data-test="form-errors">{JSON.stringify(errors, null, 2)}</pre>
            </div>
          ) : null}
          <div>
            <h3>Form Data:</h3>
            <pre data-test="form-state">{JSON.stringify(formData, null, 2)}</pre>
          </div>
        </div>,
        element
      )
    : null;
};

export default memo(FormStateDisplaySimple);
