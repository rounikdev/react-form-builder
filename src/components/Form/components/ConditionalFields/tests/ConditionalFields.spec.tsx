import { mount } from '@cypress/react';

import { FormRoot } from '@components';
import { Text } from '@ui';

import { ConditionalFields } from '../ConditionalFields';

describe('HeightTransitionBox', () => {
  const fieldNameA = 'firstName';
  const fieldNameB = 'lastName';

  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

  afterEach(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  it('Renders the field on condition', () => {
    mount(
      <FormRoot dataTest="test">
        <Text dataTest={fieldNameA} id={fieldNameA} name={fieldNameA} />
        <ConditionalFields condition={(formData) => formData[fieldNameA]?.length > 0}>
          <Text dataTest={fieldNameB} id={fieldNameB} name={fieldNameB} />
        </ConditionalFields>
      </FormRoot>
    );

    cy.get(`[data-test="${fieldNameB}-input"]`).should('not.exist');

    cy.get(`[data-test="${fieldNameA}-input"]`).type('a');

    cy.get(`[data-test="${fieldNameB}-input"]`).should('exist');
  });

  it('Has `HeightTransitionBox` with no children when `animate` prop is passed', () => {
    mount(
      <FormRoot dataTest="test">
        <Text dataTest={fieldNameA} id={fieldNameA} name={fieldNameA} />
        <ConditionalFields
          animate
          animateDataTest="test"
          condition={(formData) => formData[fieldNameA]?.length > 0}
        >
          <Text dataTest={fieldNameB} id={fieldNameB} name={fieldNameB} />
        </ConditionalFields>
      </FormRoot>
    );

    cy.get(`[data-test="test-heightTransition-container"]`).should('exist');
    cy.get(`[data-test="${fieldNameB}-input"]`).should('not.exist');
  });

  it('Has `HeightTransitionBox` with children when `animate` props is passed', () => {
    mount(
      <FormRoot dataTest="test">
        <Text dataTest={fieldNameA} id={fieldNameA} name={fieldNameA} />
        <ConditionalFields
          animate
          animateDataTest="test"
          condition={(formData) => formData[fieldNameA]?.length === 0}
        >
          <Text dataTest={fieldNameB} id={fieldNameB} name={fieldNameB} />
        </ConditionalFields>
      </FormRoot>
    );

    cy.get(`[data-test="test-heightTransition-container"]`).should('exist');
    cy.get(`[data-test="${fieldNameB}-input"]`).should('exist');
  });

  it('Runs `scrollIntoView` function when condition is met', () => {
    const mock = {
      fn() {}
    };

    cy.spy(mock, 'fn').as('args');

    window.HTMLElement.prototype.scrollIntoView = mock.fn;

    mount(
      <FormRoot dataTest="test">
        <Text dataTest={fieldNameA} id={fieldNameA} name={fieldNameA} />
        <ConditionalFields
          animate
          animateDataTest="test"
          condition={(formData) => formData[fieldNameA]?.length === 0}
        >
          <Text dataTest={fieldNameB} id={fieldNameB} name={fieldNameB} />
        </ConditionalFields>
      </FormRoot>
    );

    cy.get('@args').should('have.been.called');
  });
});
