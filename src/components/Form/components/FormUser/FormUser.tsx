import { FC, memo } from 'react';

import { useForm } from '../../hooks';
import { useFormRoot } from '../../providers';
import { FormUserProps } from '../../types';

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
