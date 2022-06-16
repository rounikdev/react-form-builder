import { mount } from '@cypress/react';

import { FormRoot, FormUser } from '@core';
import { Text } from '@ui';

describe('FormUser', () => {
  it('Mounts with children', () => {
    mount(
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

    cy.get(`[data-test="idNumber-input"]`).type('007');

    cy.get(`[data-test="read-input"]`).should('have.text', '007');
  });
});
