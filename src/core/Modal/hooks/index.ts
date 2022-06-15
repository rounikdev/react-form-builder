/* eslint-disable @typescript-eslint/ban-types */
import { Dispatch, SetStateAction, useMemo, useState } from 'react';

import { ModalElement, ModalContext, ModalAction } from '../types';

import * as actions from '../actions';

// Dispatch and SetStateAction not recognized when
// import('react').Dispatch and import('react').SetStateAction
type ModalStateAction = (
  modal: ModalElement,
  setState: Dispatch<SetStateAction<ModalContext>>
) => void;

export const useModalContextValue = (
  initialState: ModalContext
): {
  value: ModalContext;
} => {
  const [value, setValue] = useState(initialState);

  const newActions = useMemo(() => {
    return Object.keys(actions).reduce<{ [key: string]: ModalAction }>((accum, actionName) => {
      accum[actionName] = (param: ModalElement) => {
        (
          actions as {
            [key: string]: ModalStateAction;
          }
        )[actionName](param, setValue);
      };

      return accum;
    }, {});
  }, []);

  const newValue = useMemo(() => ({ ...value, actions: newActions }), [newActions, value]);

  return { value: newValue };
};
