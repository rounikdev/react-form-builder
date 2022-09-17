import { mount } from '@cypress/react';
import { composeStory } from '@storybook/testing-react';

import { initialUsers } from '../stories/data';
import Meta, { FormDemo as FormDemoStory } from '../stories/Form.stories';

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

    cy.get('[data-test="first-name-0-input"]').should('have.value', initialUsers[1].firstName);
    cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[1].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[1].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[1].phones[0].value
    );

    // Cancel:
    cy.get('[data-test="cancel-form"').click();

    cy.get('[data-test="first-name-0-input"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[0].phones[0].value
    );
    cy.get('[data-test="phone-value-0-1-input"]').should(
      'have.value',
      initialUsers[0].phones[1].value
    );

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

    cy.get('[data-test="first-name-0-input"]').should('have.value', initialUsers[1].firstName);
    cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[1].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[1].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[1].phones[0].value
    );

    // Reset:
    cy.get('[data-test="reset"').click();

    cy.get('[data-test="first-name-0-input"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[0].phones[0].value
    );
    cy.get('[data-test="phone-value-0-1-input"]').should(
      'have.value',
      initialUsers[0].phones[1].value
    );

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'true');
  });

  Cypress._.times(5, () => {
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
      cy.get('[data-test="phone-value-0-0-input"]').clear();
      cy.get('[data-test="phone-value-0-0-input"]').type(updatedPhone);
      cy.get('[data-test="save-user-0-phones"]').click();

      // Update field in the upper form:
      cy.get('[data-test="first-name-0-input"]').focus().scrollIntoView().clear();
      cy.get('[data-test="first-name-0-input"]').type(updatedFirstName);
      cy.get('[data-test="save-user-0"]').click();

      // Save the form:
      cy.get('[data-test="save-form"]').click();

      cy.get('[data-test="first-name-0-input"]').should('have.value', updatedFirstName);
      cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[0].lastName);
      cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
      cy.get('[data-test="phone-value-0-0-input"]').should('have.value', updatedPhone);
      cy.get('[data-test="phone-value-0-1-input"]').should(
        'have.value',
        initialUsers[0].phones[1].value
      );

      cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
    });
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
    cy.get('[data-test="phone-value-0-0-input"]').clear();
    cy.get('[data-test="phone-value-0-0-input"]').type(updatedPhone);

    // Cancel on that level:
    cy.get('[data-test="cancel-user-0-phones"]').click();

    // Update field in the upper form:
    cy.get('[data-test="first-name-0-input"]').clear();
    cy.get('[data-test="first-name-0-input"]').type(updatedFirstName);
    cy.get('[data-test="save-user-0"]').click();

    // Save the form:
    cy.get('[data-test="save-form"]').click();

    cy.get('[data-test="first-name-0-input"]').should('have.value', updatedFirstName);
    cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[0].phones[0].value
    );
    cy.get('[data-test="phone-value-0-1-input"]').should(
      'have.value',
      initialUsers[0].phones[1].value
    );

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
    cy.get('[data-test="phone-value-0-0-input"]').clear();
    cy.get('[data-test="phone-value-0-0-input"]').type(updatedPhone);
    cy.get('[data-test="save-user-0-phones"]').click();

    // Update field in the upper form:
    cy.get('[data-test="first-name-0-input"]').clear();
    cy.get('[data-test="first-name-0-input"]').type(updatedFirstName);

    // Cancel on the upper level:
    cy.get('[data-test="cancel-user-0"]').click();

    // Save the form:
    cy.get('[data-test="save-form"]').click();

    cy.get('[data-test="first-name-0-input"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[0].phones[0].value
    );
    cy.get('[data-test="phone-value-0-1-input"]').should(
      'have.value',
      initialUsers[0].phones[1].value
    );

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
    cy.get('[data-test="phone-value-0-0-input"]').clear();
    cy.get('[data-test="phone-value-0-0-input"]').type(updatedPhone);
    cy.get('[data-test="save-user-0-phones"]').click();

    // Update field in the upper form:
    cy.get('[data-test="first-name-0-input"]').clear();
    cy.get('[data-test="first-name-0-input"]').type(updatedFirstName);
    cy.get('[data-test="save-user-0"]').click();

    // Save the form:
    cy.get('[data-test="cancel-form"]').click();

    cy.get('[data-test="first-name-0-input"]').should('have.value', initialUsers[0].firstName);
    cy.get('[data-test="last-name-0-input"]').should('have.value', initialUsers[0].lastName);
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[0].phones[0].value
    );
    cy.get('[data-test="phone-value-0-1-input"]').should(
      'have.value',
      initialUsers[0].phones[1].value
    );

    cy.get('[data-test="users-form"').invoke('attr', 'data-pristine').should('equal', 'false');
  });

  it('Force validate selected fields and then set un-touched', () => {
    mount(<FormDemo />);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    cy.get('[data-test="add-user"]').click();

    cy.get('[data-test="error-field-first-name-2-errors"]').should('not.exist');
    cy.get('[data-test="error-field-repeat-password-errors"]').should('not.exist');

    cy.get('[data-test="force-validate-selected"]').click();

    cy.get('[data-test="error-field-first-name-2-errors"]').should('exist');
    cy.get('[data-test="error-field-repeat-password-errors"]').should('exist');

    cy.get('[data-test="set-selected-to-un-touched"]').click();

    cy.get('[data-test="error-field-first-name-2-errors"]').should('not.exist');
    cy.get('[data-test="error-field-repeat-password-errors"]').should('not.exist');
  });

  it('Reset a specific form object', () => {
    mount(<FormDemo />);

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Change the first user's name:
    cy.get('[data-test="edit-user-0"]').click();
    cy.get('[data-test="first-name-0-input"]').type('a');
    cy.get('[data-test="save-user-0"]').click();
    cy.get('[data-test="first-name-0-input"]').should(
      'have.value',
      `${initialUsers[0].firstName}a`
    );

    // Change the second user's name:
    cy.get('[data-test="edit-user-1"]').click();
    cy.get('[data-test="first-name-1-input"]').type('a');
    cy.get('[data-test="save-user-1"]').click();
    cy.get('[data-test="first-name-1-input"]').should(
      'have.value',
      `${initialUsers[1].firstName}a`
    );

    // Reset the first user's name:
    cy.get('[data-test="reset-user-0"]').click();

    // The first user's name should be reset:
    cy.get('[data-test="first-name-0-input"]').should('have.value', initialUsers[0].firstName);

    // Second user's name should stay changed:
    cy.get('[data-test="first-name-1-input"]').should(
      'have.value',
      `${initialUsers[1].firstName}a`
    );
  });

  it('Reset a specific form array', () => {
    mount(<FormDemo />);

    const newPhone = '123';

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Change the first user's name:
    cy.get('[data-test="edit-user-0"]').click();
    cy.get('[data-test="first-name-0-input"]').type('a');
    cy.get('[data-test="first-name-0-input"]').should(
      'have.value',
      `${initialUsers[0].firstName}a`
    );

    // Edit the first user's phones array:
    cy.get('[data-test="edit-user-0-phones"]').click();
    cy.get('[data-test="remove-phone-0-0"]').click();
    cy.get('[data-test="remove-phone-0-0"]').click();
    cy.get('[data-test="add-phone-user-0"]').click();
    cy.get('[data-test="phone-value-0-0-input"]').type(newPhone);
    cy.get('[data-test="save-user-0-phones"]').click();

    cy.get('[data-test^="phone-value-0-"').should('have.length', 1);
    cy.get('[data-test="phone-value-0-0-input"]').should('have.value', newPhone);

    // Reset only the phones:
    cy.get('[data-test="reset-user-0-phones"]').click();

    // The first user's name should stay changed:
    cy.get('[data-test="first-name-0-input"]').should(
      'have.value',
      `${initialUsers[0].firstName}a`
    );

    // But the phones should be reset:
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[0].phones[0].value
    );
    cy.get('[data-test="phone-value-0-1-input"]').should(
      'have.value',
      initialUsers[0].phones[1].value
    );
  });

  it('Resets through a list of field ids', () => {
    mount(<FormDemo />);

    const newPhone = '123';

    // Enable edit
    cy.get('[data-test="edit-form"').click();

    // Change the first user's name:
    cy.get('[data-test="edit-user-0"]').click();
    cy.get('[data-test="first-name-0-input"]').type('a');
    cy.get('[data-test="first-name-0-input"]').should(
      'have.value',
      `${initialUsers[0].firstName}a`
    );

    // Edit the first user's phones array:
    cy.get('[data-test="edit-user-0-phones"]').click();
    cy.get('[data-test="remove-phone-0-0"]').click();
    cy.get('[data-test="remove-phone-0-0"]').click();
    cy.get('[data-test="add-phone-user-0"]').click();
    cy.get('[data-test="phone-value-0-0-input"]').type(newPhone);
    cy.get('[data-test="save-user-0-phones"]').click();

    cy.get('[data-test^="phone-value-0-"').should('have.length', 1);
    cy.get('[data-test="phone-value-0-0-input"]').should('have.value', newPhone);

    cy.get('[data-test="save-user-0"]').click();
    cy.get('[data-test="save-form"]').click();

    // Reset the phones of the first user:
    cy.get('[data-test="reset-list"]').click();

    // The first user's name should stay changed:
    cy.get('[data-test="first-name-0-input"]').should(
      'have.value',
      `${initialUsers[0].firstName}a`
    );

    // But the phones should be reset:
    cy.get('[data-test^="phone-value-0-"').should('have.length', initialUsers[0].phones.length);
    cy.get('[data-test="phone-value-0-0-input"]').should(
      'have.value',
      initialUsers[0].phones[0].value
    );
    cy.get('[data-test="phone-value-0-1-input"]').should(
      'have.value',
      initialUsers[0].phones[1].value
    );
  });
});
