import { fireEvent } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import { FC } from 'react';

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
  label,
  name
}) => {
  const { dependencyValue, onChangeHandler, value } = useField({
    dependencyExtractor,
    initialValue: '',
    name
  });

  const built = useFieldDependency({
    dependencyValue,
    disabled,
    label
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
    const { result } = renderHook(() =>
      useFieldDependency({
        dependencyValue: null,
        disabled: false,
        label: ''
      })
    );

    expect(result.current).toEqual({ disabled: false, label: '' });
  });

  it('Generates `disabled`, `label` and `required` based on dependency', () => {
    const firstNameValue = 'John';

    const { getByDataTest, getByLabelText } = testRender(
      <FormRoot dataTest="test">
        <Text dataTest="first-name" id="first-name" name="firstName" />
        <TextField
          dataTest="last-name"
          dependencyExtractor={(formData) => ({ firstName: formData.firstName })}
          disabled={({ firstName }) => firstName === firstNameValue}
          id="last-name"
          label={({ firstName }) => firstName}
          name="lastName"
        />
      </FormRoot>
    );

    fireEvent.change(getByDataTest('first-name-input'), {
      target: { value: firstNameValue }
    });

    expect(getByDataTest('last-name')).toBeDisabled();

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByLabelText(firstNameValue)).toBeInTheDocument();
  });
});
