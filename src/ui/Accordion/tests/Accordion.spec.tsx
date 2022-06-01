import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { Basic as BasicStory } from '../stories/Accordion.stories';

const AccordionDemo = composeStory(BasicStory, Meta);

describe('Accordion', () => {
  it('Open and closes in group', () => {
    mount(<AccordionDemo />);

    // Option is opened:
    cy.get('[data-test="cats"]').scrollIntoView();
    cy.get('[data-test="cats-content-component"]').should('be.visible');

    // Close it:
    cy.get('[data-test="cats-header"]').click();
    cy.get('[data-test="cats-content-component"]').should('not.be.visible');
    // Should still be mounted:
    cy.get('[data-test="cats-content-component"]').should('exist');

    // Open the second option:
    cy.get('[data-test="dogs"]').scrollIntoView();
    cy.get('[data-test="dogs-content-component"]').should('exist');
    cy.get('[data-test="dogs-content-component"]').should('not.be.visible');
    cy.get('[data-test="dogs-header"]').click();
    cy.get('[data-test="dogs-content-component"]').should('be.visible');

    // The third one should be disabled:
    cy.get('[data-test="dogs"]').scrollIntoView();
    cy.get('[data-test="bears-header"]').should('be.disabled');
    cy.get('[data-test="bears-content-component"]').should('not.exist');

    // Open the fourth one:
    cy.get('[data-test="dolphins"').scrollIntoView();
    cy.get('[data-test="dolphins-content-component"]').should('not.exist');
    cy.get('[data-test="dolphins-header"]').click();
    cy.get('[data-test="dolphins-content-component"]').should('be.visible');

    // The second option should be still opened:
    cy.get('[data-test="dogs"]').scrollIntoView();
    cy.get('[data-test="dogs-content-component"]').should('exist');
    cy.get('[data-test="dogs-content-component"]').should('be.visible');

    // Opening the first one:
    cy.get('[data-test="cats"]').scrollIntoView();
    cy.get('[data-test="cats"]').click();
    cy.get('[data-test="cats-content-component"]').should('be.visible');

    // The second should be closed:
    cy.get('[data-test="dogs"]').scrollIntoView();
    cy.get('[data-test="dogs-content-component"]').should('exist');
    cy.get('[data-test="dogs-content-component"]').should('not.be.visible');

    cy.get('[data-test="dolphins"').scrollIntoView();
    cy.get('[data-test="dolphins-content-component"]').should('be.visible');

    // Close the fourth one:
    cy.get('[data-test="dolphins-header"]').click();
    // Its content should be unmounted:
    cy.get('[data-test="dolphins-content-component"]').should('not.exist');

    // Unmount the third option:
    cy.get('[data-test="unmount-bears"]').click();
  });
});
