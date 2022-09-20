import { waitFor } from '@testing-library/react';

import { ForceValidate, FormRoot } from '@core';
import { ValidatorModel } from '@services';
import { testRender } from '@services/utils';
import { Text } from '@ui';

describe('ForceValidate', () => {
  it('Has display name', () => {
    expect(ForceValidate.displayName).toBe('ForceValidate');
  });

  it('Mounts with children', async () => {
    const { findByDataTest, queryByDataTest, rerender } = testRender(
      <FormRoot dataTest="test">
        <ForceValidate shouldForceValidate={undefined} />
        <Text
          dataTest="test"
          disabled={false}
          id="test"
          name="test"
          validator={ValidatorModel.requiredValidator}
        />
      </FormRoot>
    );

    await waitFor(() => {
      expect(queryByDataTest('error-field-test-errors')).not.toBeInTheDocument();
    });

    rerender(
      <FormRoot dataTest="test">
        <ForceValidate shouldForceValidate={{}} />
        <Text
          dataTest="test"
          disabled={false}
          id="test"
          name="test"
          validator={ValidatorModel.requiredValidator}
        />
      </FormRoot>
    );

    expect(await findByDataTest('error-field-test-errors')).toBeInTheDocument();
  });
});
