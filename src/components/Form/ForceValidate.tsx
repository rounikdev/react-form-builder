import { FC, memo } from 'react';

import { useUpdate } from '@services';

import { useForm } from './Form';
import { ForceValidateFlag } from './types';

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