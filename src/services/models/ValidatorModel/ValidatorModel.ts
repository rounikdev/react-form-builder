import { FormStateEntryValue, Validator, ValidityCheck } from '@core';

import { FormatterModel } from '../FormatterModel';

export class ValidatorModel {
  static createMaxLengthValidator = (max: number, message = ''): Validator<string> => {
    if (max <= 0) {
      return () => ({ errors: [], valid: true });
    } else {
      return (value: string) => {
        const validityCheck: ValidityCheck = {
          errors: [],
          valid: true
        };
        if (value.length > max) {
          validityCheck.errors = [{ substitutes: [`${max}`], text: message }];
          validityCheck.valid = false;
        }

        return validityCheck;
      };
    }
  };

  static createMinLengthValidator = (min: number, message = ''): Validator<string> => {
    if (min <= 0) {
      return () => ({ errors: [], valid: true });
    } else {
      return (value: string) => {
        const validityCheck: ValidityCheck = {
          errors: [],
          valid: true
        };

        // value.length === 0 should be handled
        // by using required validator:
        if (value.length > 0 && value.length < min) {
          validityCheck.errors = [{ substitutes: [`${min}`], text: message }];
          validityCheck.valid = false;
        }

        return validityCheck;
      };
    }
  };

  static createMaxDateValidator = (
    max: string,
    message = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formatDate = (timestamp: number) => max
  ): Validator<string> => {
    return (value: string) => {
      const maxDate = Date.parse(max);
      const valDate = Date.parse(value);
      const validityCheck: ValidityCheck = {
        errors: [],
        valid: true
      };

      if (value && valDate > maxDate) {
        validityCheck.errors = [{ substitutes: [`${formatDate(maxDate)}`], text: message }];
        validityCheck.valid = false;
      }

      return validityCheck;
    };
  };

  static createMinDateValidator = (
    min: string,
    message = '',
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formatDate = (timestamp: number) => min
  ): Validator<string> => {
    return (value: string) => {
      const minDate = Date.parse(min);
      const valDate = Date.parse(value);
      const validityCheck: ValidityCheck = {
        errors: [],
        valid: true
      };

      if (value && valDate < minDate) {
        validityCheck.errors = [{ substitutes: [`${formatDate(minDate)}`], text: message }];
        validityCheck.valid = false;
      }

      return validityCheck;
    };
  };

  static createMaxNumberValidator = (max: number, message = ''): Validator<string> => {
    return (value: string) => {
      const valNumber = parseFloat(value);
      const validityCheck: ValidityCheck = {
        errors: [],
        valid: true
      };

      if (value && valNumber > max) {
        validityCheck.errors = [{ substitutes: [`${max}`], text: message }];
        validityCheck.valid = false;
      }

      return validityCheck;
    };
  };

  static createMinNumberValidator = (min: number, message = ''): Validator<string> => {
    return (value: string) => {
      const valNumber = parseFloat(value);
      const validityCheck: ValidityCheck = {
        errors: [],
        valid: true
      };

      if (value && valNumber < min) {
        validityCheck.errors = [{ substitutes: [`${min}`], text: message }];
        validityCheck.valid = false;
      }

      return validityCheck;
    };
  };

  static createCharacterSetValidator = (characterSet: RegExp, message = ''): Validator<string> => {
    return (value: string) => {
      const validityCheck: ValidityCheck = {
        errors: [],
        valid: true
      };

      if (!characterSet.test(value)) {
        validityCheck.errors = [{ text: message }];
        validityCheck.valid = false;
      }

      return validityCheck;
    };
  };

  static requiredValidator = (value: unknown): ValidityCheck => {
    let validityCheck: ValidityCheck;

    if (value) {
      validityCheck = {
        errors: [],
        valid: true
      };
    } else {
      validityCheck = {
        errors: [{ text: 'requiredField' }],
        valid: false
      };
    }

    return validityCheck;
  };

  static createRequiredValidator = (message = 'requiredField'): Validator<unknown> => {
    return (value: unknown) => {
      return !!value
        ? {
            errors: [],
            valid: true
          }
        : {
            errors: [{ text: message }],
            valid: false
          };
    };
  };

  static createExactLengthValidator = (
    max: number,
    message = '',
    maxToDisplay: number = max
  ): Validator<string> => {
    if (max <= 0) {
      return () => ({ errors: [], valid: true });
    } else {
      return (value: string) => {
        const validityCheck: ValidityCheck = {
          errors: [],
          valid: true
        };
        if (value.length !== max) {
          validityCheck.errors = [{ substitutes: [`${maxToDisplay}`], text: message }];
          validityCheck.valid = false;
        }

        return validityCheck;
      };
    }
  };

  static composeValidators = function <T>(...validators: Validator<T>[]): Validator<T> {
    return async (value: T, dependencyValue?: FormStateEntryValue) => {
      const validityCheck: ValidityCheck = {
        errors: [],
        valid: true
      };

      return (
        await Promise.all(validators.map((validator) => validator(value, dependencyValue)))
      ).reduce((accumulatedValidityCheck, currentValidityCheck) => {
        return {
          errors: [...accumulatedValidityCheck.errors, ...currentValidityCheck.errors],
          valid: accumulatedValidityCheck.valid && currentValidityCheck.valid
        };
      }, validityCheck);
    };
  };

  static creditCardValidator: Validator<string> = (value, message?: string) => {
    let validityCheck: ValidityCheck;

    const pattern = FormatterModel.creditCardPattern;

    if (value.length === 0 || value.length === pattern.length) {
      validityCheck = {
        errors: [],
        valid: true
      };
    } else {
      validityCheck = {
        errors: [{ text: message || 'invalidCreditCard' }],
        valid: false
      };
    }

    return validityCheck;
  };

  static monthYearValidator: Validator<string> = (value) => {
    const pattern = /^(((0)[1-9])|((1)[0-2]))( \/ )\d{2}$/i;
    const isValid = pattern.test(value);

    let validityCheck: ValidityCheck;

    if (value.length === 0 || isValid) {
      validityCheck = {
        errors: [],
        valid: true
      };
    } else {
      validityCheck = {
        errors: [{ text: 'invalidMonthYear' }],
        valid: false
      };
    }

    return validityCheck;
  };
}
