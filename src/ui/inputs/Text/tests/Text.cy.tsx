import { mount } from '@cypress/react18';

import { Text } from '../Text';

describe('Text', () => {
  it('Mounts input', () => {
    mount(<Text dataTest="test" id="text" name="text" />);

    // Initial state:
    cy.get('[data-test="test-input"').should('exist');
  });

  it('With `Mask`', () => {
    mount(<Text dataTest="test" id="text" initialValue="1234" name="text" pattern="** **" />);

    cy.get('[data-test="test-input"').focus();

    cy.get('[data-test="test-mask-text"').should('have.text', '1234*');
  });

  it('With function `initialValue` that returns `undefined`', () => {
    mount(
      <Text
        dataTest="test"
        id="text"
        initialValue={() => undefined as unknown as string}
        name="text"
      />
    );

    cy.get('[data-test="test-input"').should('have.value', '');
  });

  it('With `disabled` boolean', () => {
    mount(<Text dataTest="test" disabled id="text" name="text" />);

    cy.get('[data-test="test-input"').should('be.disabled');
  });
});
