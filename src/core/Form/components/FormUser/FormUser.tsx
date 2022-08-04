import { FC, memo } from 'react';

import { useForm } from '@core/Form/hooks';
import { useFormRoot } from '@core/Form/providers';
import { FormUserProps } from '@core/Form/types';

export const FormUser: FC<FormUserProps> = memo(({ children }) => {
  const formContext = useForm();
  const formRootContext = useFormRoot();

  return children({
    formContext,
    formRootContext
  });
});

FormUser.displayName = 'FormUser';
