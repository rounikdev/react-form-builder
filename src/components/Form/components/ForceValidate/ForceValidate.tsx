import { FC, memo } from 'react';
import { useUpdate } from '@rounik/react-custom-hooks';

import { useForm } from '../../hooks';
import { ForceValidateFlag } from '../../types';

export const ForceValidate: FC<{
  shouldForceValidate: ForceValidateFlag | undefined;
}> = memo(({ shouldForceValidate }) => {
  const context = useForm();

  useUpdate(() => {
    if (shouldForceValidate) {
      context.methods.forceValidate();
    }
  }, [shouldForceValidate]);

  return null;
});

ForceValidate.displayName = 'ForceValidate';
