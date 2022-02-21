import { createContext } from 'react';

import { FormContext } from '../types';

export const initialFormContext: FormContext = {
  forceValidateFlag: {},
  methods: {
    forceValidate: () => {
      // default function
    },
    getFieldId: () => '',
    removeFromForm: () => {
      // default function
    },
    reset: () => {
      // default function
    },
    setInForm: () => {
      // default function
    }
  },
  resetFlag: {},
  state: {},
  valid: false
};

export const FormContextInstance = createContext<FormContext>(initialFormContext);
