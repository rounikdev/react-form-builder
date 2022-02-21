import { FC } from 'react';
import userEvent from '@testing-library/user-event';

import { TestTextInput, testRender } from '@services/utils';

import { FormRoot } from '../../../components';
import { FormSideEffect } from '../FormSideEffect';

interface TestFormWithFormSideEffectProps {
  effect: (dependencies: unknown[]) => void | Promise<void>;
}

const TestFormWithFormSideEffect: FC<TestFormWithFormSideEffectProps> = ({ effect }) => {
  return (
    <FormRoot dataTest="sideEffectForm">
      <FormSideEffect
        dependencyExtractor={(formData) => {
          return [formData.fieldA];
        }}
        effect={effect}
      />
      <TestTextInput dataTestInput="fieldA" initialValue="John" name="fieldA" />
    </FormRoot>
  );
};

describe('FormSideEffect', () => {
  it('Has display name', () => {
    expect(FormSideEffect.displayName).toBe('FormSideEffect');
  });

  it('Change in form state triggers the effect', () => {
    const initialValue = 'John';
    const changedValue = 'Ana';
    const mockEffect = jest.fn();

    const { getByDataTest } = testRender(<TestFormWithFormSideEffect effect={mockEffect} />);

    expect(mockEffect).toHaveBeenCalledTimes(2);

    expect(mockEffect.mock.calls[0][0]).toEqual([undefined]);
    expect(mockEffect.mock.calls[1][0]).toEqual([initialValue]);

    userEvent.clear(getByDataTest('fieldA'));
    userEvent.type(getByDataTest('fieldA'), changedValue);

    const lastCall = mockEffect.mock.calls.pop();

    expect(lastCall[0]).toEqual([changedValue]);
  });

  it('Provides Form context methods with the second argument of the effect callback', () => {
    const mockEffect = jest.fn();

    testRender(<TestFormWithFormSideEffect effect={mockEffect} />);

    expect(mockEffect).toHaveBeenCalledTimes(2);

    expect(typeof mockEffect.mock.calls[0][1].methods).toBe('object');
    expect(typeof mockEffect.mock.calls[0][1].methods.focusField).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.forceValidate).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.getFieldId).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.registerFieldErrors).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.removeFromForm).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.reset).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.scrollFieldIntoView).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.setFieldValue).toBe('function');
    expect(typeof mockEffect.mock.calls[0][1].methods.setInForm).toBe('function');
  });
});
