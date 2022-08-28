import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { FC, useState } from 'react';

import { FormRoot } from '@core/Form/components';
import { useField } from '@core/Form/hooks';
import { DependencyExtractor, UseFieldDependencyConfig } from '@core/Form/types';
import { testRender } from '@services/utils';
import { Testable } from '@types';
import { Text } from '@ui';

import { useFieldDependency } from '../useFieldDependency';

interface TextFieldProps<T> extends Omit<UseFieldDependencyConfig<T>, 'dependencyValue'>, Testable {
  dependencyExtractor?: DependencyExtractor;
  id: string;
  name: string;
}

const TextField: FC<TextFieldProps<string>> = ({
  dataTest,
  dependencyExtractor,
  disabled,
  id,
  initialValue,
  label,
  name
}) => {
  const { dependencyValue, onChangeHandler, value } = useField({
    dependencyExtractor,
    initialValue: typeof initialValue === 'function' ? '' : initialValue,
    name
  });

  const built = useFieldDependency({
    dependencyValue,
    disabled,
    initialValue,
    label,
    onChangeHandler
  });

  return (
    <>
      <label htmlFor={id}>{built.label} </label>
      <input
        data-test={dataTest}
        disabled={built.disabled}
        id={id}
        name={name}
        value={value}
        onChange={(e) => onChangeHandler(e.target.value)}
      />
    </>
  );
};

describe('useFieldDependency', () => {
  it('Provides `disabled` and `label`', () => {
    const mockOnChange = jest.fn();

    const { result } = renderHook(() =>
      useFieldDependency({
        dependencyValue: null,
        disabled: false,
        initialValue: '',
        label: '',
        onChangeHandler: mockOnChange
      })
    );

    expect(result.current).toEqual({ disabled: false, label: '' });
    expect(mockOnChange).toBeCalledTimes(1);
  });

  it('Generates `disabled`, `label` and `value` based on dependency', () => {
    const firstNameValue = 'John';

    const { getByDataTest, getByLabelText } = testRender(
      <FormRoot dataTest="test">
        <Text dataTest="first-name" id="first-name" name="firstName" />
        <TextField
          dataTest="last-name"
          dependencyExtractor={(formData) => ({ firstName: formData.firstName })}
          disabled={({ firstName }) => firstName === firstNameValue}
          id="last-name"
          initialValue={({ firstName }) => firstName}
          label={({ firstName }) => firstName}
          name="lastName"
        />
      </FormRoot>
    );

    fireEvent.change(getByDataTest('first-name-input'), {
      target: { value: firstNameValue }
    });

    expect(getByDataTest('last-name')).toBeDisabled();
    expect(getByDataTest('last-name')).toHaveValue(firstNameValue);

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByLabelText(firstNameValue)).toBeInTheDocument();
  });

  it('Generates `value` based on `initialValue` update', () => {
    const lastNameValue = 'Doe';

    const TestComponent: FC = () => {
      const [initialValue, setInitialValue] = useState('');

      return (
        <>
          <button data-test="update-button" onClick={() => setInitialValue(lastNameValue)}>
            Update initial value
          </button>
          <TextField
            dataTest="last-name"
            id="last-name"
            initialValue={initialValue}
            name="lastName"
          />
        </>
      );
    };

    const { getByDataTest } = testRender(<TestComponent />);

    userEvent.click(getByDataTest('update-button'));

    expect(getByDataTest('last-name')).toHaveValue(lastNameValue);
  });
});
