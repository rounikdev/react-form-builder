import { FC, memo } from 'react';

import { useUpdate } from '@rounik/react-custom-hooks';

import { useForm } from '@core/Form/hooks';
import { ForceValidateFlag } from '@core/Form/types';

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
