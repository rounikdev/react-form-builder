import { createContext } from 'react';

import { FormContext } from '../types';

export const initialFormContext: FormContext = {
  forceValidateFlag: {},
  isEdit: false,
  methods: {
    cancel: () => {
      // default function
    },
    edit: () => {
      // default function
    },
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
    save: () => {
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

FormContextInstance.displayName = 'FormContext';
