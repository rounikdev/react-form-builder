import { FC, useState } from 'react';
import { mount } from '@cypress/react';

import { ValidationError } from '@core';

import { ErrorField } from '../ErrorField';

const TestComponent: FC = () => {
  const [isError, setIsError] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);

  return (
    <>
      <button
        data-test="toggle-btn"
        onClick={() => {
          setIsError((prevState) => !prevState);
          setErrors([{ text: 'Error' }]);
        }}
        type="button"
      >
        Toggle
      </button>
      <ErrorField dataTest="test" errors={errors} isError={isError} />
    </>
  );
};

describe('ErrorField', () => {
  it('Mounts', () => {
    mount(<TestComponent />);

    cy.get('[data-test="toggle-btn"]').click();
    cy.get('[data-test="test-errors"]').should('exist');

    cy.get('li').should('have.length', 1).contains('Error');

    cy.get('[data-test="toggle-btn"]').click();
  });
});
