import { FC, useEffect } from 'react';

import { useUpdatedRef } from '@rounik/react-custom-hooks';

import { useForm } from '@core/Form/hooks';
import { useFormRoot } from '@core/Form/providers';
import { FormSideEffectProps } from '@core/Form/types';
import { GlobalModel } from '@services';

export const FormSideEffect: FC<FormSideEffectProps> = ({ dependencyExtractor, effect }) => {
  const { methods } = useForm();
  const { formData, methods: formRootMethods } = useFormRoot();

  const dependencies = dependencyExtractor(formData);

  const effectRef = useUpdatedRef(effect);

  useEffect(() => {
    effectRef.current(dependencies, { methods: { form: methods, root: formRootMethods } });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [GlobalModel.createStableDependency(dependencies)]);

  return null;
};

FormSideEffect.displayName = 'FormSideEffect';
