import { FormStateEntryValue, Validator, ValidityCheck } from '../../../components';

export class ValidatorModel {
  static createMaxLengthValidator = (max: number, message: string): Validator<string> => {
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

  static createMinLengthValidator = (min: number, message: string): Validator<string> => {
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
    message: string,
    formatDate: (timestamp: number) => string
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
    message: string,
    formatDate: (timestamp: number) => string
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

  static createMaxNumberValidator = (max: number, message: string): Validator<string> => {
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

  static createMinNumberValidator = (min: number, message: string): Validator<string> => {
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

  static createCharacterSetValidator = (
    characterSet: RegExp,
    message: string
  ): Validator<string> => {
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

  static createRequiredValidator = (message: string): Validator<unknown> => {
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
    message: string,
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
}