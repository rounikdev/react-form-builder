import userEvent from '@testing-library/user-event';

import { FormRoot, FormUser } from '@core';
import { testRender } from '@services/utils';
import { Text } from '@ui';

describe('FormUser', () => {
  it('Has display name', () => {
    expect(FormUser.displayName).toBe('FormUser');
  });

  it('Mounts with children', async () => {
    const { findByDataTest, getByText } = testRender(
      <FormRoot dataTest="test">
        <FormUser>
          {({ formRootContext: { formData } }) => {
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

    //! https://github.com/testing-library/user-event/issues/565
    jest.useRealTimers();
    await userEvent.type(await findByDataTest('idNumber-input'), '007');

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('007')).toBeInTheDocument();
  });
});
