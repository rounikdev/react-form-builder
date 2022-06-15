import { FC, memo } from 'react';

import { useForm } from '@core/Form/hooks';
import { useFormRoot } from '@core/Form/providers';
import { FormUserProps } from '@core/Form/types';

export const FormUser: FC<FormUserProps> = memo(({ children }) => {
  const { isEdit, isParentEdit, localEdit, methods } = useForm();
  const { formData } = useFormRoot();

  return children({
    formData,
    isEdit,
    isParentEdit,
    localEdit,
    methods
  });
});

FormUser.displayName = 'FormUser';
