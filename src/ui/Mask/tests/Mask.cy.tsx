import { mount } from '@cypress/react18';

import { Mask } from '../Mask';

describe('Mask', () => {
  it('Mounts', () => {
    mount(<Mask className="" dataTest="test" focused pattern="** **" value="2343" />);

    // Initial state:
    cy.get('[data-test="test-mask-text"').should('have.text', '2343*');
  });
});
