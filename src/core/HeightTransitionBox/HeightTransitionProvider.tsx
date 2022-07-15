import { createContext, FC, memo, useContext, useMemo, useState } from 'react';

import { HeightTransitionBoxContext, HeightTransitionProviderProps } from './types';

const initialContext: HeightTransitionBoxContext = {
  actions: {
    forceUpdate: /* istanbul ignore next */ () => {}
  },
  shouldForceUpdate: {}
};

const HeightTransitionContext = createContext<HeightTransitionBoxContext>(initialContext);

export const useHeightTransition = (): HeightTransitionBoxContext => {
  return useContext(HeightTransitionContext);
};

export const HeightTransitionProvider: FC<HeightTransitionProviderProps> = memo(({ children }) => {
  const [state, setState] = useState(initialContext);

  const actions = useMemo(() => {
    return {
      forceUpdate: () => {
        setState((prevState) => ({ ...prevState, shouldForceUpdate: {} }));
      }
    };
  }, []);

  const value = useMemo(() => ({ ...state, actions }), [actions, state]);

  return (
    <HeightTransitionContext.Provider value={value}>{children}</HeightTransitionContext.Provider>
  );
});

HeightTransitionProvider.displayName = 'HeightTransitionProvider';
