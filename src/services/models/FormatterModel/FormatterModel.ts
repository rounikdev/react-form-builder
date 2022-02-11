import { Formatter, OldNewValue } from '../../../components';

export class FormatterModel {
  static composeFormatters = <T>(...formatters: (Formatter<T> | undefined)[]): Formatter<T> => {
    return ({ newValue, oldValue }: OldNewValue<T>) => {
      return formatters.reduce((currentValue, currentFormatter) => {
        if (currentFormatter) {
          return currentFormatter({ newValue: currentValue, oldValue });
        } else {
          return currentValue;
        }
      }, newValue);
    };
  };

  static createMaxLengthFormatter = (maxLength: number): Formatter<string> => {
    if (maxLength < 0) {
      return ({ newValue }) => newValue;
    }
    return ({ newValue }) => newValue.substring(0, maxLength);
  };

  static createSymbolSeparatorFormatter = (step: number, symbol = '-'): Formatter<string> => {
    if (step <= 0) {
      return ({ newValue }) => newValue;
    }
    return ({ newValue }) =>
      newValue.split('').reduce((formatted, character, index) => {
        if (index && index % step === 0) {
          return `${formatted}${symbol}${character}`;
        } else {
          return `${formatted}${character}`;
        }
      }, '');
  };

  static formatIntegerString = ({ rawValue = '', allowNegative = false }): string => {
    let newValue = allowNegative
      ? FormatterModel.removeNonDigitFromNegativeString(rawValue)
      : FormatterModel.removeNonDigitFromString(rawValue);

    if (allowNegative && newValue.length > 2 && newValue[0] === '-' && newValue[1] === '0') {
      newValue = newValue.slice(0, 1) + newValue.slice(2);
    }
    if (newValue.length > 1 && newValue[0] === '0') {
      newValue = newValue.substring(1);
    }
    return newValue;
  };

  static formatNumberToAmount = ({
    value,
    setValue
  }: {
    value: string;
    setValue?: (newValue: string) => void;
  }) => {
    let newValue = value;

    if (value === '') {
      newValue = '';
    } else if (['0', '0.', '0.0', '0.00', '.', '.0', '.00'].indexOf(value) !== -1) {
      newValue = '0.00';
    } else if (value[value.length - 2] === '.') {
      newValue = `${value}0`;
    } else if (value[value.length - 1] === '.') {
      newValue = `${value}00`;
    } else if (value !== '0' && value.indexOf('.') === -1) {
      newValue = `${value}.00`;
    }

    if (setValue) {
      setValue(newValue);

      return '';
    } else {
      return newValue;
    }
  };

  static integerOnlyFormatter: Formatter<string> = ({ newValue }) => {
    let output = newValue?.replace(/\D/g, '');

    if (output?.length > 1 && output[0] === '0') {
      output = output.substring(1);
    }

    return output;
  };

  static removeFirstCharZeroFormatter: Formatter<string> = ({ newValue }) =>
    newValue[0] === '0' ? newValue.substring(1) : newValue;

  static removeNonDigitFromNegativeString = (rawValue: string): string =>
    rawValue.replace(/(?!^)\-|[^-\d]+/, '');

  static removeNonDigitFromString = (rawValue: string): string => rawValue.replace(/\D/g, '');

  static stringToAmountFormatter = ({ newValue: rawValue = '', allowNegative = false }): string => {
    let newValue = rawValue;
    const indexOfFirstDot = rawValue.indexOf('.');

    if (indexOfFirstDot !== -1) {
      let integerString = rawValue.substring(0, indexOfFirstDot);
      let decimalString = rawValue.substring(indexOfFirstDot + 1);

      integerString = allowNegative
        ? FormatterModel.formatIntegerString({ rawValue: integerString, allowNegative: true })
        : FormatterModel.formatIntegerString({ rawValue: integerString });
      decimalString = FormatterModel.removeNonDigitFromString(decimalString);
      decimalString = decimalString.substring(0, 2);

      if (integerString && !decimalString) {
        newValue = `${integerString}.`;
      } else if (!integerString && decimalString) {
        newValue = `0.${decimalString}`;
      } else {
        newValue = `${integerString}.${decimalString}`;
      }
    } else {
      newValue = allowNegative
        ? FormatterModel.formatIntegerString({ rawValue: newValue, allowNegative: true })
        : FormatterModel.formatIntegerString({ rawValue: newValue });
    }

    return newValue;
  };

  static stringToNegativeAmountFormatter: Formatter<string> = ({
    newValue: rawValue = ''
  }): string => {
    return FormatterModel.stringToAmountFormatter({ newValue: rawValue, allowNegative: true });
  };

  static stringToPositiveAmountFormatter: Formatter<string> = ({
    newValue: rawValue = ''
  }): string => {
    return FormatterModel.stringToAmountFormatter({ newValue: rawValue });
  };

  static upperCaseFormatter: Formatter<string> = ({ newValue }) => {
    return newValue?.toUpperCase();
  };

  static zerosAndIntegerFormatter: Formatter<string> = ({ newValue }) => {
    return newValue?.replace(/\D/g, '');
  };
}
