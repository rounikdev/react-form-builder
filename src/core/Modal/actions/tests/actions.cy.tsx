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
    cy.get('[data-test="modal-2-close-modal"]').click();
    cy.get('[data-test="modal-2-backdrop-modal"]').should('not.exist');
    cy.get('[data-test="modal-1-backdrop-modal"]').should('be.visible');

    // Open Modal 3 with clearPreceding
    cy.get('[data-test="open-modal-2"]').click();
    cy.get('[data-test="modal-2-backdrop-modal"]').should('be.visible');

    cy.get('[data-test="open-modal-3"]').click();
    cy.get('[data-test="modal-3-backdrop-modal"]').should('be.visible');

    // Try to open Modal 1 again
    cy.get('[data-test="modal-3-close-modal"]').click();
    cy.get('[data-test="open-modal-1"]').click();
    cy.get('[data-test="open-modal-1-1"]').click();
    cy.get('[data-test="modal-1-backdrop-modal"]').should('be.visible');

    // Try to hide non existing Modal 4
    cy.get('[data-test="hide-modal-4"]').click();
    cy.get('[data-test="modal-1-backdrop-modal"]').should('be.visible');
  });
});
