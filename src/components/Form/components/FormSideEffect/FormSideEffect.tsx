import { FC, useEffect } from 'react';

import { useUpdatedRef } from '@services';

import { useForm } from '../../hooks';
import { useFormRoot } from '../../providers';
import { FormSideEffectProps } from '../../types';

export const FormSideEffect: FC<FormSideEffectProps> = ({ dependencyExtractor, effect }) => {
  const { methods } = useForm();
  const { formData } = useFormRoot();

  const dependencies = dependencyExtractor(formData);

  const effectRef = useUpdatedRef(effect);

  useEffect(() => {
    effectRef.current(dependencies, { methods });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return null;
};

FormSideEffect.displayName = 'FormSideEffect';
