import { mount } from '@cypress/react';

import { Text } from '../Text';

describe('Text', () => {
  it('Mounts input', () => {
    mount(<Text dataTest="text" id="text" name="text" />);

    // Initial state:
    cy.get('[data-test="text-input"').should('exist');
  });
});
