import { createContext } from 'react';

import { FormContext } from '../types';

export const initialFormContext: FormContext = {
  forceValidateFlag: {},
  isEdit: false,
  isParentEdit: false,
  localEdit: false,
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
    },
    touchParent: () => {
      // default function
    }
  },
  state: {},
  valid: false
};

export const FormContextInstance = createContext<FormContext>(initialFormContext);

FormContextInstance.displayName = 'FormContext';
