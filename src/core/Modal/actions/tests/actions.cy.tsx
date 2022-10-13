import { mount } from '@cypress/react18';
import { composeStory } from '@storybook/testing-react';

import Meta, { Basic as BasicStory } from '../../stories/Modal.stories';

const ModalDemo = composeStory(BasicStory, Meta);

describe('Accordion', () => {
  it('Multiple modal show, forceShow, clearPreceding, hideModalById', () => {
    mount(<ModalDemo />);

    // Open Modal 1
    cy.get('[data-test="open-modal-1"]').click();
    cy.get('[data-test="modal-1-backdrop-modal"]').should('be.visible');

    // Close Modal 1
    cy.get('[data-test="modal-1-backdrop-modal"]').click();
    cy.get('[data-test="modal-1-backdrop-modal"]').should('not.exist');

    // Open Modal 1
    cy.get('[data-test="open-modal-1"]').click();
    cy.get('[data-test="modal-1-backdrop-modal"]').should('be.visible');

    // Open Modal 2 with forceShow
    cy.get('[data-test="open-modal-2"]').click();
    cy.get('[data-test="modal-2-backdrop-modal"]').should('be.visible');

    // Close Modal 2
    cy.get('[data-test="modal-2-backdrop-modal"]').click();
    // cy.get('[data-test="modal-2-backdrop-modal"]').should('not.exist');
  });
});
