import { DependencyExtractor, ValidityCheck } from '../types';

export type Phone = { id: string; value: string };

export type User = { firstName: string; id: string; lastName: string; phones: Phone[] };

export const initialUsers: User[] = [
  {
    id: '1',
    firstName: 'Maria',
    lastName: 'Ignatova',
    phones: [
      { id: '1', value: '243567483' },
      { id: '2', value: '443571443' }
    ]
  },
  {
    id: '2',
    firstName: 'Ivan',
    lastName: 'Ivanov',
    phones: [{ id: '1', value: '363567473' }]
  }
];

export const nameValidator = (value: string): ValidityCheck => {
  let validityCheck: ValidityCheck = {
    errors: [],
    valid: true
  };

  if (!value || value.length < 3) {
    validityCheck = {
      errors: [{ text: 'Must contain at least 3 characters' }],
      valid: false
    };
  }

  return validityCheck;
};

export const asyncNameValidator = (value: string): Promise<ValidityCheck> => {
  return new Promise((resolve) => {
    setTimeout(
      () =>
        resolve({
          errors: value.length > 3 ? [] : [{ text: 'Must be longer than 3 characters' }],
          valid: value.length > 3
        }),
      3000
    );
  });
};

export const phoneValidator = (value: string): ValidityCheck => {
  let validityCheck: ValidityCheck = {
    errors: [],
    valid: true
  };

  if (value.length !== 9) {
    validityCheck = {
      errors: [{ text: 'Must have 9 characters' }],
      valid: false
    };
  }

  return validityCheck;
};

export const passwordValidator = (val: string): ValidityCheck => {
  if (val && val.indexOf('a') >= 0) {
    return {
      errors: [],
      valid: true
    };
  } else {
    return {
      errors: [{ text: "Password must contain the 'a' character" }],
      valid: false
    };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const repeatPasswordValidator = (val: string, depVal: any): ValidityCheck => {
  const basicValidityCheck = passwordValidator(val);

  if (val === depVal?.password) {
    return basicValidityCheck;
  } else {
    return {
      errors: [...basicValidityCheck.errors, { text: "Passwords don't match" }],
      valid: false
    };
  }
};

export const passwordDependencyExtractor: DependencyExtractor = (formData) => {
  return { password: formData.password, usersLength: formData.users.length };
};

export const createUser = (): User => ({
  firstName: '',
  id: `${new Date().getTime()}`,
  lastName: '',
  phones: []
});

export const createPhone = (): Phone => ({
  id: `${new Date().getTime()}`,
  value: ''
});
