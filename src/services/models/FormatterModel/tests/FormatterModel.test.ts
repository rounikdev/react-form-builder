import { GlobalModel } from '@root/../dist';
import { FormatterModel } from '../FormatterModel';

describe('FormatterModel', () => {
  it('composeFormatters', () => {
    const tests = [
      {
        formatter: FormatterModel.composeFormatters(FormatterModel.createMaxLengthFormatter(3)),
        input: 'abcd',
        expected: 'abc'
      },
      {
        formatter: FormatterModel.composeFormatters(
          FormatterModel.createMaxLengthFormatter(3),
          undefined
        ),
        input: 'abcd',
        expected: 'abc'
      },
      {
        formatter: FormatterModel.composeFormatters(
          FormatterModel.upperCaseFormatter,
          FormatterModel.createMaxLengthFormatter(3),
          undefined
        ),
        input: 'abcd',
        expected: 'ABC'
      },
      // NB: Formatters order matters!!!
      {
        formatter: FormatterModel.composeFormatters(
          FormatterModel.createMaxLengthFormatter(3),
          FormatterModel.integerOnlyFormatter
        ),
        input: 'abcd1',
        expected: ''
      },
      {
        formatter: FormatterModel.composeFormatters(
          FormatterModel.integerOnlyFormatter,
          FormatterModel.createMaxLengthFormatter(3)
        ),
        input: 'abcd1',
        expected: '1'
      }
    ];

    tests.forEach(({ formatter, input, expected }) => {
      expect(formatter({ newValue: input })).toEqual(expected);
    });
  });

  it('createMaxLengthFormatter', () => {
    const tests = [
      { formatter: FormatterModel.createMaxLengthFormatter(3), input: 'abc', expected: 'abc' },
      { formatter: FormatterModel.createMaxLengthFormatter(3), input: 'abcd', expected: 'abc' },
      { formatter: FormatterModel.createMaxLengthFormatter(0), input: 'abcd', expected: '' },
      { formatter: FormatterModel.createMaxLengthFormatter(-1), input: 'abcd', expected: 'abcd' }
    ];

    tests.forEach(({ formatter, input, expected }) => {
      expect(formatter({ newValue: input })).toEqual(expected);
    });
  });

  it('createSymbolSeparatorFormatter', () => {
    const tests = [
      {
        formatter: FormatterModel.createSymbolSeparatorFormatter(2, '.'),
        input: 'abc',
        expected: 'ab.c'
      },
      {
        formatter: FormatterModel.createSymbolSeparatorFormatter(3),
        input: 'abcd',
        expected: 'abc-d'
      },
      {
        formatter: FormatterModel.createSymbolSeparatorFormatter(0),
        input: 'abcd',
        expected: 'abcd'
      },
      {
        formatter: FormatterModel.createSymbolSeparatorFormatter(-1),
        input: 'abcd',
        expected: 'abcd'
      },
      {
        formatter: FormatterModel.createSymbolSeparatorFormatter(4),
        input: 'abcd',
        expected: 'abcd'
      }
    ];

    tests.forEach(({ formatter, input, expected }) => {
      expect(formatter({ newValue: input })).toEqual(expected);
    });
  });

  it('formatIntegerString', () => {
    const tests = [
      { input: '00', expect: '0' },
      { input: 'f0', expect: '0' }
    ];

    tests.forEach((item) =>
      expect(FormatterModel.formatIntegerString({ rawValue: item.input })).toEqual(item.expect)
    );

    const negativeValuesCases = [
      { input: '-00', expect: '-0' },
      { input: '-01', expect: '-1' },
      { input: 'f0', expect: '0' },
      { input: '-423ff434', expect: '-423434' }
    ];

    negativeValuesCases.forEach((item) =>
      expect(
        FormatterModel.formatIntegerString({ rawValue: item.input, allowNegative: true })
      ).toEqual(item.expect)
    );
  });

  it('formatNumberToAmount', () => {
    const mockSetValue = jest.fn();

    const tests = [
      { input: '', expect: '' },
      { input: '0', expect: '0.00' },
      { input: '0.', expect: '0.00' },
      { input: '0.0', expect: '0.00' },
      { input: '0.00', expect: '0.00' },
      { input: '.', expect: '0.00' },
      { input: '.0', expect: '0.00' },
      { input: '.00', expect: '0.00' },
      { input: '1.2', expect: '1.20' },
      { input: '1.', expect: '1.00' },
      { input: '1', expect: '1.00' },
      { input: '1.20', expect: '', expectSetValue: 1, setValue: mockSetValue }
    ];

    tests.forEach((item) => {
      expect(
        FormatterModel.formatNumberToAmount({
          value: item.input,
          setValue: item.setValue
        })
      ).toEqual(item.expect);

      if (item.setValue) {
        expect(mockSetValue).toBeCalledTimes(item.expectSetValue);
      }
    });
  });

  it('integerOnlyFormatter', () => {
    const test = [
      {
        input: 'nm',
        expected: ''
      },
      {
        input: 'nm1',
        expected: '1'
      },
      {
        input: 'John20 Doe',
        expected: '20'
      },
      {
        input: '01',
        expected: '1'
      }
    ];

    test.forEach(({ input, expected }) =>
      expect(FormatterModel.integerOnlyFormatter({ newValue: input })).toEqual(expected)
    );
  });

  it('removeFirstCharZeroFormatter', () => {
    const tests = [
      {
        input: '01',
        expected: '1'
      },
      { input: '10', expected: '10' }
    ];

    tests.forEach(({ input, expected }) => {
      expect(FormatterModel.removeFirstCharZeroFormatter({ newValue: input })).toEqual(expected);
    });
  });

  it('removeNonDigitFromString', () => {
    const tests = [
      { input: 'f', expect: '' },
      { input: 'f0', expect: '0' }
    ];

    tests.forEach((item) =>
      // only number digits or empty string
      expect(GlobalModel.removeNonDigitFromString(item.input)).toBe(item.expect)
    );
  });

  it('stringToAmountFormatter', () => {
    const tests = [
      { input: undefined, expect: '' },
      { input: '', expect: '' },
      { input: '1.f', expect: '1.' },
      { input: 'f.1', expect: '0.1' },
      { input: '1.1', expect: '1.1' },
      { input: 'f4', expect: '4' }
    ];

    tests.forEach((item) =>
      expect(FormatterModel.stringToAmountFormatter({ newValue: item.input as string })).toEqual(
        item.expect
      )
    );

    const negativeTestCases = [
      { input: undefined, expect: '' },
      { input: '-', expect: '-' },
      { input: '-1.f', expect: '-1.' },
      { input: '-f4.0', expect: '-4.0' },
      { input: '-1.1', expect: '-1.1' },
      { input: '-f4', expect: '-4' },
      { input: '-f4-5', expect: '-4-5' }
    ];

    negativeTestCases.forEach((item) =>
      expect(
        FormatterModel.stringToAmountFormatter({
          newValue: item.input as string,
          allowNegative: true
        })
      ).toEqual(item.expect)
    );
  });

  it('upperCaseFormatter', () => {
    const tests = [
      { input: 'aaa', expected: 'AAA' },
      { input: 'a1b2c3', expected: 'A1B2C3' },
      { input: 'aAa', expected: 'AAA' },
      { input: 'a a  a', expected: 'A A  A' }
    ];

    tests.forEach(({ input, expected }) => {
      expect(FormatterModel.upperCaseFormatter({ newValue: input })).toEqual(expected);
    });
  });

  it('zerosAndIntegerFormatter', () => {
    const test = [
      {
        input: 'nm',
        expected: ''
      },
      {
        input: 'nm1',
        expected: '1'
      },
      {
        input: 'John20 Doe',
        expected: '20'
      },
      {
        input: '01',
        expected: '01'
      }
    ];

    test.forEach(({ input, expected }) =>
      expect(FormatterModel.zerosAndIntegerFormatter({ newValue: input })).toEqual(expected)
    );
  });
});
