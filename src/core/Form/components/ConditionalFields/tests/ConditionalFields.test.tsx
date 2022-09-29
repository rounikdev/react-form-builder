import { fireEvent, waitFor } from '@testing-library/react';

import { FormRoot } from '@core';
import { testRender } from '@services/utils';
import { Text } from '@ui';

import { ConditionalFields } from '../ConditionalFields';

describe('ConditionalFields', () => {
  const fieldNameA = 'firstName';
  const fieldNameB = 'lastName';

  const originalScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

  afterEach(() => {
    window.HTMLElement.prototype.scrollIntoView = originalScrollIntoView;
  });

  it('Has display name', () => {
    expect(ConditionalFields.displayName).toBe('ConditionalFields');
  });

  it('Renders the field on condition', async () => {
    const { findByDataTest, getByDataTest, queryByDataTest } = testRender(
      <FormRoot dataTest="test">
        <Text dataTest={fieldNameA} id={fieldNameA} name={fieldNameA} />
        <ConditionalFields condition={(formData) => formData[fieldNameA]?.length > 0}>
          <Text dataTest={fieldNameB} id={fieldNameB} name={fieldNameB} />
        </ConditionalFields>
      </FormRoot>
    );

    expect(queryByDataTest(`${fieldNameB}-input`)).not.toBeInTheDocument();

    fireEvent.change(getByDataTest(`${fieldNameA}-input`), { target: { value: 'a' } });
    await waitFor(async () => {
      expect(await findByDataTest(`${fieldNameB}-input`)).toBeInTheDocument();
    });

    fireEvent.change(getByDataTest(`${fieldNameA}-input`), { target: { value: '' } });
    await waitFor(async () => {
      expect(queryByDataTest(`${fieldNameB}-input`)).not.toBeInTheDocument();
    });
  });

  it('Has `HeightTransitionBox` with no children when `animate` prop is passed', () => {
    const { getByDataTest, queryByDataTest } = testRender(
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

    expect(getByDataTest('test-heightTransition-container')).toBeInTheDocument();
    expect(queryByDataTest(`${fieldNameB}-input`)).not.toBeInTheDocument();
  });

  it('Has `HeightTransitionBox` with children when `animate` props is passed', async () => {
    const { getByDataTest } = testRender(
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

    await waitFor(() => {
      expect(getByDataTest('test-heightTransition-container')).toBeInTheDocument();
    });

    expect(getByDataTest(`${fieldNameB}-input`)).toBeInTheDocument();
  });

  it('Runs `scrollIntoView` function when condition is met', async () => {
    const mockScrollIntoView = jest.fn();

    window.HTMLElement.prototype.scrollIntoView = mockScrollIntoView;

    testRender(
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

    await waitFor(() => {
      expect(mockScrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    });
  });

  it('Has `HeightTransitionBox` with children when `hidden` props is passed', async () => {
    const { getByDataTest } = testRender(
      <FormRoot dataTest="test">
        <Text dataTest={fieldNameA} id={fieldNameA} name={fieldNameA} />
        <ConditionalFields
          animate
          animateDataTest="test"
          hidden
          condition={(formData) => formData[fieldNameA]?.length === 0}
        >
          <Text dataTest={fieldNameB} id={fieldNameB} name={fieldNameB} />
        </ConditionalFields>
      </FormRoot>
    );

    await waitFor(() => {
      expect(
        window.getComputedStyle(getByDataTest('test-heightTransition-container')).display
      ).toBe('block');
    });
  });
});
