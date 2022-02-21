import { useCallback, useState } from 'react';

import { ForceValidateFlag, ResetFlag } from '../../types';

export const useFormInteraction = ({ onReset }: { onReset?: () => void }) => {
  const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag>({});

  const [resetFlag, setResetFlag] = useState<ResetFlag>({});

  const forceValidate = useCallback(() => {
    setForceValidateFlag({});
  }, []);

  const reset = useCallback(() => {
    setResetFlag({});

    if (onReset) {
      onReset();
    }
  }, [onReset]);

  return {
    forceValidate,
    forceValidateFlag,
    reset,
    resetFlag
  };
};
