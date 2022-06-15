import userEvent from '@testing-library/user-event';

import { FormRoot, FormUser } from '@core';
import { Text } from '@ui';
import { testRender } from '@services/utils';

describe('FormUser', () => {
  it('Has display name', () => {
    expect(FormUser.displayName).toBe('FormUser');
  });

  it('Mounts with children', async () => {
    const { findByDataTest, getByText } = testRender(
      <FormRoot dataTest="test">
        <FormUser>
          {({ formData }) => {
            return (
              <>
                <Text
                  dataTest="idNumber"
                  disabled={false}
                  expandError
                  id="idNumber"
                  label="idNumber"
                  name="idNumber"
                  placeholder="idNumber"
                />
                <p data-test="read-input">{formData.idNumber}</p>
              </>
            );
          }}
        </FormUser>
      </FormRoot>
    );

    userEvent.type(await findByDataTest('idNumber-input'), '007');

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('007')).toBeInTheDocument();
  });
});
