import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { FormDemo as FormDemoStory } from '../stories/Form.stories';

const FormDemo = composeStory(FormDemoStory, Meta);

describe('FormDemo', () => {
  it('Start edit, add new user, remove the first user and cancel edit', () => {
    mount(<FormDemo />);

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', 2);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Add user:
    cy.get('[data-test="add-user"').click();

    cy.get('[data-test^="user-"').should('have.length', 3);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');

    // Remove the first user:
    cy.get('[data-test="remove-user-0"').click();

    cy.get('[data-test^="user-"').should('have.length', 2);

    cy.get('[data-test="first-name-0"]').should('have.value', 'Ivan');
    cy.get('[data-test="last-name-0"]').should('have.value', 'Ivanov');
    cy.get('[data-test^="phone-value-0-"').should('have.length', 1);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', '363567473');

    // Cancel:
    cy.get('[data-test="cancel-form"').click();

    cy.get('[data-test="first-name-0"]').should('have.value', 'Maria');
    cy.get('[data-test="last-name-0"]').should('have.value', 'Ignatova');
    cy.get('[data-test^="phone-value-0-"').should('have.length', 2);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', '243567483');
    cy.get('[data-test="phone-value-0-1"]').should('have.value', '443571443');

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
  });

  it('Start edit, add new user, remove the first user and reset', () => {
    mount(<FormDemo />);

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', 2);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Add user:
    cy.get('[data-test="add-user"').click();

    cy.get('[data-test^="user-"').should('have.length', 3);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');

    // Remove the first user:
    cy.get('[data-test="remove-user-0"').click();

    cy.get('[data-test^="user-"').should('have.length', 2);

    cy.get('[data-test="first-name-0"]').should('have.value', 'Ivan');
    cy.get('[data-test="last-name-0"]').should('have.value', 'Ivanov');
    cy.get('[data-test^="phone-value-0-"').should('have.length', 1);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', '363567473');

    // Reset:
    cy.get('[data-test="reset"').click();

    cy.get('[data-test="first-name-0"]').should('have.value', 'Maria');
    cy.get('[data-test="last-name-0"]').should('have.value', 'Ignatova');
    cy.get('[data-test^="phone-value-0-"').should('have.length', 2);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', '243567483');
    cy.get('[data-test="phone-value-0-1"]').should('have.value', '443571443');

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');
  });
});
