import { useMemo } from 'react';

import { useField } from '@components/Form';

import { DefaultSingleOption, LabelExtractor, ValueExtractor } from '../types';
import { UseRadioGroup, UseRadioGroupReturnType } from './types';

const defaultLabelExtractor: LabelExtractor<DefaultSingleOption, string> = (
  option: DefaultSingleOption
) => option.label;

const defaultValueExtractor: ValueExtractor<DefaultSingleOption, string> = (option): string =>
  option.value;

export const useRadioGroup: (args: UseRadioGroup) => UseRadioGroupReturnType = ({
  dependencyExtractor,
  initialValue,
  labelExtractor = defaultLabelExtractor,
  name,
  options,
  sideEffect,
  validator,
  valueExtractor = defaultValueExtractor
}) => {
  const props = useField<string>({
    dependencyExtractor,
    initialValue,
    name,
    sideEffect,
    validator
  });

  const wrappedOptions = useMemo(() => {
    return options.map((option) => ({
      checked: valueExtractor(option) === props.value,
      label: labelExtractor(option),
      onChangeHandler: () => {
        props.onChangeHandler(valueExtractor(option));
      },
      value: valueExtractor(option)
    }));
  }, [labelExtractor, options, props, valueExtractor]);

  return { ...props, wrappedOptions };
};
