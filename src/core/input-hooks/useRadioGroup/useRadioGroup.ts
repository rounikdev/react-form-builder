import { useMemo } from 'react';

import { useField } from '@core/Form';

import { DefaultSingleOption, ExtractorFromSingleOption } from '../types';
import { UseRadioGroup, UseRadioGroupReturnType } from './types';

const defaultInputValueExtractor: ExtractorFromSingleOption<DefaultSingleOption, string> = (
  option
): string => option.value;

const defaultLabelExtractor: ExtractorFromSingleOption<DefaultSingleOption, string> = (
  option: DefaultSingleOption
) => option.label;

const defaultTitleExtractor: ExtractorFromSingleOption<DefaultSingleOption, string> = (
  option: DefaultSingleOption
) => option.label;

const defaultValueExtractor: ExtractorFromSingleOption<DefaultSingleOption, string> = (
  option
): string => option.value;

export const useRadioGroup = <T, R>({
  dependencyExtractor,
  initialValue,
  inputValueExtractor = defaultInputValueExtractor,
  labelExtractor = defaultLabelExtractor,
  name,
  options,
  required,
  sideEffect,
  titleExtractor = defaultTitleExtractor,
  validator,
  valueExtractor = defaultValueExtractor
}: UseRadioGroup): UseRadioGroupReturnType<T, R> => {
  const props = useField<T>({
    dependencyExtractor,
    initialValue,
    name,
    required,
    sideEffect,
    validator
  });

  const enhancedOptions = useMemo(() => {
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

  return { ...props, enhancedOptions };
};
