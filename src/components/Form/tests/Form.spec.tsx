import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import Meta, { FormDemo as FormDemoStory } from '../stories/Form.stories';
import { initialUsers } from '../stories/data';

const FormDemo = composeStory(FormDemoStory, Meta);

describe('FormDemo', () => {
  it('Start edit, add new user, remove the first user and cancel edit', () => {
    mount(<FormDemo />);

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Add user:
    cy.get('[data-test="add-user"').click();

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length + 1);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');

    // Remove the first user:
    cy.get('[data-test="remove-user-0"').click();

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    cy.get('[data-test="first-name-0"]').should('have.value', initialUsers[1].firstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[1].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[1].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', initialUsers[1].phones[0].value);

    // Cancel:
    cy.get('[data-test="cancel-form"').click();

    cy.get('[data-test="first-name-0"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', initialUsers[0].phones[0].value);
    cy.get('[data-test="phone-value-0-1"]').should('have.value', initialUsers[0].phones[1].value);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
  });

  it('Start edit, add new user, remove the first user and reset', () => {
    mount(<FormDemo />);

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Add user:
    cy.get('[data-test="add-user"').click();

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length + 1);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');

    // Remove the first user:
    cy.get('[data-test="remove-user-0"').click();

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    cy.get('[data-test="first-name-0"]').should('have.value', initialUsers[1].firstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[1].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[1].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', initialUsers[1].phones[0].value);

    // Reset:
    cy.get('[data-test="reset"').click();

    cy.get('[data-test="first-name-0"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', initialUsers[0].phones[0].value);
    cy.get('[data-test="phone-value-0-1"]').should('have.value', initialUsers[0].phones[1].value);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');
  });

  it('Edit nested forms', () => {
    mount(<FormDemo />);

    const updatedFirstName = 'Gergana';

    const updatedPhone = '123456789';

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Enable edit of nested form
    cy.get('[data-test="edit-user-0"').click();

    // Enable edit of another level of nested form
    cy.get('[data-test="edit-user-0-phones"').click();

    // Update field in the most nested form:
    cy.get('[data-test="phone-value-0-0"]').clear();
    cy.get('[data-test="phone-value-0-0"]').type(updatedPhone);
    cy.get('[data-test="save-user-0-phones"]').click();

    // Update field in the upper form:
    cy.get('[data-test="first-name-0"]').clear();
    cy.get('[data-test="first-name-0"]').type(updatedFirstName);
    cy.get('[data-test="save-user-0"]').click();

    // Save the form:
    cy.get('[data-test="save-form"]').click();

    cy.get('[data-test="first-name-0"]').should('have.value', updatedFirstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', updatedPhone);
    cy.get('[data-test="phone-value-0-1"]').should('have.value', initialUsers[0].phones[1].value);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
  });

  it('Edit nested forms - cancel the most nested form', () => {
    mount(<FormDemo />);

    const updatedFirstName = 'Gergana';

    const updatedPhone = '123456789';

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Enable edit of nested form
    cy.get('[data-test="edit-user-0"').click();

    // Enable edit of another level of nested form
    cy.get('[data-test="edit-user-0-phones"').click();

    // Update field in the most nested form:
    cy.get('[data-test="phone-value-0-0"]').clear();
    cy.get('[data-test="phone-value-0-0"]').type(updatedPhone);

    // Cancel on that level:
    cy.get('[data-test="cancel-user-0-phones"]').click();

    // Update field in the upper form:
    cy.get('[data-test="first-name-0"]').clear();
    cy.get('[data-test="first-name-0"]').type(updatedFirstName);
    cy.get('[data-test="save-user-0"]').click();

    // Save the form:
    cy.get('[data-test="save-form"]').click();

    cy.get('[data-test="first-name-0"]').should('have.value', updatedFirstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', initialUsers[0].phones[0].value);
    cy.get('[data-test="phone-value-0-1"]').should('have.value', initialUsers[0].phones[1].value);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
  });

  it('Edit nested forms - cancel the upper form', () => {
    mount(<FormDemo />);

    const updatedFirstName = 'Gergana';

    const updatedPhone = '123456789';

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Enable edit of nested form
    cy.get('[data-test="edit-user-0"').click();

    // Enable edit of another level of nested form
    cy.get('[data-test="edit-user-0-phones"').click();

    // Update field in the most nested form:
    cy.get('[data-test="phone-value-0-0"]').clear();
    cy.get('[data-test="phone-value-0-0"]').type(updatedPhone);
    cy.get('[data-test="save-user-0-phones"]').click();

    // Update field in the upper form:
    cy.get('[data-test="first-name-0"]').clear();
    cy.get('[data-test="first-name-0"]').type(updatedFirstName);

    // Cancel on the upper level:
    cy.get('[data-test="cancel-user-0"]').click();

    // Save the form:
    cy.get('[data-test="save-form"]').click();

    cy.get('[data-test="first-name-0"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', initialUsers[0].phones[0].value);
    cy.get('[data-test="phone-value-0-1"]').should('have.value', initialUsers[0].phones[1].value);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
  });

  it('Edit nested forms - cancel on root level', () => {
    mount(<FormDemo />);

    const updatedFirstName = 'Gergana';

    const updatedPhone = '123456789';

    // Initial state:
    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');

    cy.get('[data-test^="user-"').should('have.length', initialUsers.length);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Enable edit of nested form
    cy.get('[data-test="edit-user-0"').click();

    // Enable edit of another level of nested form
    cy.get('[data-test="edit-user-0-phones"').click();

    // Update field in the most nested form:
    cy.get('[data-test="phone-value-0-0"]').clear();
    cy.get('[data-test="phone-value-0-0"]').type(updatedPhone);
    cy.get('[data-test="save-user-0-phones"]').click();

    // Update field in the upper form:
    cy.get('[data-test="first-name-0"]').clear();
    cy.get('[data-test="first-name-0"]').type(updatedFirstName);
    cy.get('[data-test="save-user-0"]').click();

    // Save the form:
    cy.get('[data-test="cancel-form"]').click();

    cy.get('[data-test="first-name-0"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0"]').should('have.value', initialUsers[0].phones[0].value);
    cy.get('[data-test="phone-value-0-1"]').should('have.value', initialUsers[0].phones[1].value);

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
  });
});
