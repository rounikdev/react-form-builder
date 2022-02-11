import { useMemo } from 'react';

import { useField } from '@components/Form';

import { DefaultSingleOption, ExtractFromSingleOption } from '../types';
import { UseRadioGroup, UseRadioGroupReturnType } from './types';

const defaultInputValueExtractor: ExtractFromSingleOption<DefaultSingleOption, string> = (
  option
): string => option.value;

const defaultLabelExtractor: ExtractFromSingleOption<DefaultSingleOption, string> = (
  option: DefaultSingleOption
) => option.label;

const defaultTitleExtractor: ExtractFromSingleOption<DefaultSingleOption, string> = (
  option: DefaultSingleOption
) => option.label;

const defaultValueExtractor: ExtractFromSingleOption<DefaultSingleOption, string> = (
  option
): string => option.value;

export const useRadioGroup = <T, R>({
  dependencyExtractor,
  initialValue,
  inputValueExtractor = defaultInputValueExtractor,
  labelExtractor = defaultLabelExtractor,
  name,
  options,
  sideEffect,
  titleExtractor = defaultTitleExtractor,
  validator,
  valueExtractor = defaultValueExtractor
}: UseRadioGroup): UseRadioGroupReturnType<T, R> => {
  const props = useField<T>({
    dependencyExtractor,
    initialValue,
    name,
    sideEffect,
    validator
  });

  const wrappedOptions = useMemo(() => {
    return options.map((option) => ({
      checked: valueExtractor(option) === props.value,
      inputValue: inputValueExtractor(option),
      label: labelExtractor(option),
      onChangeHandler: () => {
        props.onChangeHandler(valueExtractor(option));
      },
      title: titleExtractor(option),
      value: valueExtractor(option)
    }));
  }, [inputValueExtractor, labelExtractor, options, props, titleExtractor, valueExtractor]);

  return { ...props, wrappedOptions };
};
