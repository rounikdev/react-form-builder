import { mount } from '@cypress/react18';

import { LabelField } from '../LabelField';

import styles from '../LabelField.scss';

describe('LabelField', () => {
  it('Mounts', () => {
    mount(<LabelField dataTest="text" id="text" label="Text" />);

    cy.get('[data-test="text-label"').should('exist').should('have.text', 'Text');
  });

  it('With `required` flag', () => {
    mount(<LabelField dataTest="text" id="text" required />);

    cy.get('[data-test="text-required"').should('exist').should('have.text', 'requiredField');
  });

  it('Without `required` flag', () => {
    mount(<LabelField dataTest="text" id="text" label="Text" />);

    cy.get('[data-test="text-required"').should('not.exist');
  });

  it('With `requiredLabel`', () => {
    mount(
      <LabelField dataTest="text" id="text" label="Text" required requiredLabel="Required text" />
    );

    cy.get('[data-test="text-required"').should('exist').should('have.text', 'Required text');
  });

  it('With `noLabelTruncate`', () => {
    mount(
      <LabelField
        dataTest="text"
        id="text"
        label="Text"
        noLabelTruncate
        required
        requiredLabel="Required text"
      />
    );

    cy.get('[data-test="text-label"')
      .should('exist')
      .should('have.class', styles.Label)
      .and('have.class', styles.NoLabelTruncate);

    cy.get('[data-test="text-required"')
      .should('exist')
      .should('have.class', styles.Required)
      .and('have.class', styles.NoLabelTruncate);
  });

  it('With `noLabelTruncate` and no `required`', () => {
    mount(
      <LabelField
        dataTest="text"
        id="text"
        label="Text"
        noLabelTruncate
        requiredLabel="Required text"
      />
    );

    cy.get('[data-test="text-label"')
      .should('exist')
      .should('have.class', styles.Label)
      .and('have.class', styles.NoLabelTruncate);

    cy.get('[data-test="text-required"').should('not.exist');
  });
});
