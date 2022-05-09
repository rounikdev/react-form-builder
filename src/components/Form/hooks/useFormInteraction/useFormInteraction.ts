import { useCallback, useState } from 'react';

import { ForceValidateFlag } from '../../types';

export const useFormInteraction = () => {
  const [forceValidateFlag, setForceValidateFlag] = useState<ForceValidateFlag>({});

  const forceValidate = useCallback(() => {
    setForceValidateFlag({});
  }, []);

  return {
    forceValidate,
    forceValidateFlag
  };
};
