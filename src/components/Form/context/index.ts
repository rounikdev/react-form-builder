import { createContext } from 'react';

import { FormContext } from '../types';

export const initialFormContext: FormContext = {
  fieldToBeSet: {
    id: '',
    value: undefined
  },
  focusedField: '',
  forceValidateFlag: {},
  methods: {
    focusField: () => {
      // default function
    },
    forceValidate: () => {
      // default function
    },
    getFieldId: () => '',
    registerFieldErrors: undefined,
    removeFromForm: () => {
      // default function
    },
    reset: () => {
      // default function
    },
    scrollFieldIntoView: () => {
      // default function
    },
    setFieldValue: () => {
      // default function
    },
    setInForm: () => {
      // default function
    }
  },
  resetFlag: {},
  scrolledField: '',
  state: {},
  valid: false
};

export const FormContextInstance = createContext<FormContext>(initialFormContext);
