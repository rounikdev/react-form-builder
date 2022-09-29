import { FC } from 'react';

import { useUpdatedRef, useUpdateExtended } from '@rounik/react-custom-hooks';

import { useForm } from '@core/Form/hooks';
import { useFormRoot } from '@core/Form/providers';
import { FormSideEffectProps } from '@core/Form/types';

export const FormSideEffect: FC<FormSideEffectProps> = ({ dependencyExtractor, effect }) => {
  const { methods } = useForm();
  const { formData, methods: formRootMethods } = useFormRoot();

  const dependencies = dependencyExtractor(formData);

  const effectRef = useUpdatedRef(effect);

  useUpdateExtended(
    () => {
      effectRef.current(dependencies, { methods: { form: methods, root: formRootMethods } });
    },
    [dependencies],
    true
  );

  return null;
};

FormSideEffect.displayName = 'FormSideEffect';
