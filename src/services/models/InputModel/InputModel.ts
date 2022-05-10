import { Formatter, OldNewValue, Pattern } from '../../../components';

export class InputModel {
  static composeFormatters = <T>(...formatters: Formatter<T>[]): Formatter<T> => {
    return ({ newValue, oldValue }: OldNewValue<T>) => {
      return formatters.reduce((currentValue, currentFormatter) => {
        return currentFormatter({ newValue: currentValue, oldValue });
      }, newValue);
    };
  };

  static integerOnlyFormatter: Formatter<string> = ({ newValue }) => {
    let output = newValue?.replace(/\D/g, '');

    if (output?.length > 1 && output[0] === '0') {
      output = output.substring(1);
    }

    return output;
  };

  static createMaxLengthFormatter = (maxLength: number): Formatter<string> => {
    return ({ oldValue, newValue }) =>
      maxLength < newValue.length ? (oldValue as string) : newValue;
  };

  // Mask validators

  static creditCardPattern: Pattern = '****  ****  ****  ****';

  static monthYearPattern: Pattern = 'mm / yy';

  static creditCardFormatter: Formatter<string> = ({
    newValue,
    oldValue = ''
  }: OldNewValue<string>) =>
    InputModel.valueSplitter({
      goForward: newValue?.length > oldValue?.length,
      pattern: InputModel.creditCardPattern,
      patternDelimiter: '  ',
      value: InputModel.removeNonDigitFromString(newValue)
    });

  static monthYearFormatter: Formatter<string> = ({
    newValue,
    oldValue = ''
  }: OldNewValue<string>) =>
    InputModel.valueSplitter({
      goForward: newValue?.length > oldValue?.length,
      pattern: InputModel.monthYearPattern,
      patternDelimiter: ' / ',
      value: InputModel.removeNonDigitFromString(newValue)
    });

  static valueSplitter = ({
    goForward,
    pattern,
    patternDelimiter,
    value
  }: {
    goForward: boolean;
    pattern: Pattern;
    patternDelimiter: string;
    value: string;
  }) => {
    const patterSplitted = pattern.split(patternDelimiter);

    let valueFormatted = value.split(patternDelimiter).join('').replace(/\s/g, '');
    let indexCounter = 0;

    const output = patterSplitted.reduce((accum, patternString, index) => {
      let innerAccumulation = '';

      innerAccumulation = Array.from(patternString).reduce((innerAccum) => {
        if (valueFormatted.length > 0) {
          if (indexCounter < index) {
            indexCounter++;
          }

          innerAccum += valueFormatted[0];
          valueFormatted = valueFormatted.substring(1);
        } else {
          innerAccum += '';
        }

        return innerAccum;
      }, '');

      if (
        accum.length > 0 &&
        (innerAccumulation !== '' ||
          (goForward &&
            accum.length ===
              patternString.length * (indexCounter + 1) + patternDelimiter.length * indexCounter))
      ) {
        accum += `${patternDelimiter}${innerAccumulation}`;
      } else {
        accum += innerAccumulation;
      }

      return accum;
    }, '');

    return output;
  };

  static removeNonDigitFromString = (value: string) => value.replace(/\D/g, '');
}
