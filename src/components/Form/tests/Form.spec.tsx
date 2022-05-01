import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { FormDemo as FormDemoStory } from '../stories/Form.stories';

const FormDemo = composeStory(FormDemoStory, Meta);

describe('FormDemo', () => {
  it('Add new user, remove the first user and reset', () => {
    mount(<FormDemo />);

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', 2);

    // Add user:
    cy.get('[data-test="add-user"').click();

    cy.get('[data-test^="user-"').should('have.length', 3);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');

    // Remove the first user:
    cy.get('[data-test="remove-user-0"').click();

    cy.get('[data-test^="user-"').should('have.length', 2);

    cy.get('#first-name-0').should('have.value', 'Ivan');
    cy.get('#last-name-0').should('have.value', 'Ivanov');

    // Reset:
    cy.get('[data-test="reset"').click();

    cy.get('#first-name-0').should('have.value', 'Maria');
    cy.get('#last-name-0').should('have.value', 'Ignatova');

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');
  });
});
