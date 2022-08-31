import { createContext } from 'react';

import { FormContext } from '../types';

export const initialFormContext: FormContext = {
  focused: false,
  forceValidateFlag: {},
  formOnlyErrors: [],
  isEdit: false,
  isParentEdit: false,
  localEdit: false,
  methods: {
    blurParent: () => {
      // default function
    },
    cancel: () => {
      // default function
    },
    edit: () => {
      // default function
    },
    focusParent: () => {
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
  touched: false,
  valid: false
};

export const FormContextInstance = createContext<FormContext>(initialFormContext);

FormContextInstance.displayName = 'FormContext';
