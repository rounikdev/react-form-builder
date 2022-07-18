import { GlobalModel } from '@services/models/GlobalModel';

import { FormatterModel } from '../FormatterModel';

describe('FormatterModel', () => {
  it('composeFormatters', () => {
    const tests = [
      {
        expected: 'abc',
        formatter: FormatterModel.composeFormatters(FormatterModel.createMaxLengthFormatter(3)),
        input: 'abcd'
      },
      {
        expected: 'abc',
        formatter: FormatterModel.composeFormatters(
          FormatterModel.createMaxLengthFormatter(3),
          undefined
        ),
        input: 'abcd'
      },
      {
        expected: 'ABC',
        formatter: FormatterModel.composeFormatters(
          FormatterModel.upperCaseFormatter,
          FormatterModel.createMaxLengthFormatter(3),
          undefined
        ),
        input: 'abcd'
      },
      // NB: Formatters order matters!!!
      {
        expected: '',
        formatter: FormatterModel.composeFormatters(
          FormatterModel.createMaxLengthFormatter(3),
          FormatterModel.integerOnlyFormatter
        ),
        input: 'abcd1'
      },
      {
        expected: '1',
        formatter: FormatterModel.composeFormatters(
          FormatterModel.integerOnlyFormatter,
          FormatterModel.createMaxLengthFormatter(3)
        ),
        input: 'abcd1'
      }
    ];

    tests.forEach(({ expected, formatter, input }) => {
      expect(formatter({ newValue: input })).toEqual(expected);
    });
  });

  it('createMaxLengthFormatter', () => {
    const tests = [
      { expected: 'abc', formatter: FormatterModel.createMaxLengthFormatter(3), input: 'abc' },
      { expected: 'abc', formatter: FormatterModel.createMaxLengthFormatter(3), input: 'abcd' },
      { expected: '', formatter: FormatterModel.createMaxLengthFormatter(0), input: 'abcd' },
      { expected: 'abcd', formatter: FormatterModel.createMaxLengthFormatter(-1), input: 'abcd' }
    ];

    tests.forEach(({ expected, formatter, input }) => {
      expect(formatter({ newValue: input })).toEqual(expected);
    });
  });

  it('createSymbolSeparatorFormatter', () => {
    const tests = [
      {
        expected: 'ab.c',
        formatter: FormatterModel.createSymbolSeparatorFormatter(2, '.'),
        input: 'abc'
      },
      {
        expected: 'abc-d',
        formatter: FormatterModel.createSymbolSeparatorFormatter(3),
        input: 'abcd'
      },
      {
        expected: 'abcd',
        formatter: FormatterModel.createSymbolSeparatorFormatter(0),
        input: 'abcd'
      },
      {
        expected: 'abcd',
        formatter: FormatterModel.createSymbolSeparatorFormatter(-1),
        input: 'abcd'
      },
      {
        expected: 'abcd',
        formatter: FormatterModel.createSymbolSeparatorFormatter(4),
        input: 'abcd'
      }
    ];

    tests.forEach(({ expected, formatter, input }) => {
      expect(formatter({ newValue: input })).toEqual(expected);
    });
  });

  it('formatIntegerString', () => {
    const tests = [
      { expect: '0', input: '00' },
      { expect: '0', input: 'f0' },
      { expect: '', input: undefined },
      { allowNegative: true, expect: '-0', input: '-f0' }
    ];

    tests.forEach((item) =>
      expect(
        FormatterModel.formatIntegerString({
          allowNegative: item.allowNegative,
          rawValue: item.input
        })
      ).toEqual(item.expect)
    );

    const negativeValuesCases = [
      { expect: '-0', input: '-00' },
      { expect: '-1', input: '-01' },
      { expect: '0', input: 'f0' },
      { expect: '-423434', input: '-423ff434' }
    ];

    negativeValuesCases.forEach((item) =>
      expect(
        FormatterModel.formatIntegerString({ allowNegative: true, rawValue: item.input })
      ).toEqual(item.expect)
    );
  });

  it('formatNumberToAmount', () => {
    const mockSetValue = jest.fn();

    const tests = [
      { expect: '', input: '' },
      { expect: '0.00', input: '0' },
      { expect: '0.00', input: '0.' },
      { expect: '0.00', input: '0.0' },
      { expect: '0.00', input: '0.00' },
      { expect: '0.00', input: '.' },
      { expect: '0.00', input: '.0' },
      { expect: '0.00', input: '.00' },
      { expect: '1.20', input: '1.2' },
      { expect: '1.00', input: '1.' },
      { expect: '1.00', input: '1' },
      { expect: '', expectSetValue: 1, input: '1.20', setValue: mockSetValue }
    ];

    tests.forEach((item) => {
      expect(
        FormatterModel.formatNumberToAmount({
          setValue: item.setValue,
          value: item.input
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
        expected: '',
        input: 'nm'
      },
      {
        expected: '1',
        input: 'nm1'
      },
      {
        expected: '20',
        input: 'John20 Doe'
      },
      {
        expected: '1',
        input: '01'
      }
    ];

    test.forEach(({ expected, input }) =>
      expect(FormatterModel.integerOnlyFormatter({ newValue: input })).toEqual(expected)
    );
  });

  it('removeFirstCharZeroFormatter', () => {
    const tests = [
      {
        expected: '1',
        input: '01'
      },
      { expected: '10', input: '10' }
    ];

    tests.forEach(({ expected, input }) => {
      expect(FormatterModel.removeFirstCharZeroFormatter({ newValue: input })).toEqual(expected);
    });
  });

  it('removeNonDigitFromString', () => {
    const tests = [
      { expect: '', input: 'f' },
      { expect: '0', input: 'f0' }
    ];

    tests.forEach((item) =>
      // only number digits or empty string
      expect(GlobalModel.removeNonDigitFromString(item.input)).toBe(item.expect)
    );
  });

  it('stringToAmountFormatter', () => {
    const tests = [
      { expect: '', input: undefined },
      { expect: '', input: '' },
      { expect: '1.', input: '1.f' },
      { expect: '0.1', input: 'f.1' },
      { expect: '1.1', input: '1.1' },
      { expect: '4', input: 'f4' }
    ];

    tests.forEach((item) =>
      expect(FormatterModel.stringToAmountFormatter({ newValue: item.input as string })).toEqual(
        item.expect
      )
    );

    const negativeTestCases = [
      { expect: '', input: undefined },
      { expect: '-', input: '-' },
      { expect: '-1.', input: '-1.f' },
      { expect: '-4.0', input: '-f4.0' },
      { expect: '-1.1', input: '-1.1' },
      { expect: '-4', input: '-f4' },
      { expect: '-45', input: '-f4-5' }
    ];

    negativeTestCases.forEach((item) =>
      expect(
        FormatterModel.stringToAmountFormatter({
          allowNegative: true,
          newValue: item.input as string
        })
      ).toEqual(item.expect)
    );
  });

  it('upperCaseFormatter', () => {
    const tests = [
      { expected: 'AAA', input: 'aaa' },
      { expected: 'A1B2C3', input: 'a1b2c3' },
      { expected: 'AAA', input: 'aAa' },
      { expected: 'A A  A', input: 'a a  a' }
    ];

    tests.forEach(({ expected, input }) => {
      expect(FormatterModel.upperCaseFormatter({ newValue: input })).toEqual(expected);
    });
  });

  it('zerosAndIntegerFormatter', () => {
    const test = [
      {
        expected: '',
        input: 'nm'
      },
      {
        expected: '1',
        input: 'nm1'
      },
      {
        expected: '20',
        input: 'John20 Doe'
      },
      {
        expected: '01',
        input: '01'
      }
    ];

    test.forEach(({ expected, input }) =>
      expect(FormatterModel.zerosAndIntegerFormatter({ newValue: input })).toEqual(expected)
    );
  });

  it('stringToNegativeAmountFormatter', () => {
    const test = [
      {
        expected: '-0.0',
        input: '-a0.0'
      },
      {
        expected: '0.0',
        input: 'a0.0'
      },
      {
        expected: '-0.00',
        input: '-a0.00b0'
      },
      {
        expected: '',
        input: undefined
      }
    ];

    test.forEach(({ expected, input }) =>
      expect(FormatterModel.stringToNegativeAmountFormatter({ newValue: input as string })).toEqual(
        expected
      )
    );
  });

  it('stringToPositiveAmountFormatter', () => {
    const test = [
      {
        expected: '0.0',
        input: '-a0.0'
      },
      {
        expected: '0.0',
        input: 'a0.0'
      },
      {
        expected: '0.00',
        input: '-a0.00b0'
      },
      {
        expected: '',
        input: undefined
      }
    ];

    test.forEach(({ expected, input }) =>
      expect(FormatterModel.stringToPositiveAmountFormatter({ newValue: input as string })).toEqual(
        expected
      )
    );
  });

  it('creditCardFormatter', () => {
    const test = [
      {
        expected: '',
        input: 'nm'
      },
      {
        expected: '1',
        input: 'nm1'
      },
      {
        expected: '1234  5689  04',
        input: '1234568904'
      },
      {
        expected: '1234  5689  0432  4321',
        input: '1234568904324321'
      }
    ];

    test.forEach(({ expected, input }) =>
      expect(FormatterModel.creditCardFormatter({ newValue: input })).toEqual(expected)
    );
  });

  it('monthYearFormatter', () => {
    const test = [
      {
        expected: '',
        input: 'nm'
      },
      {
        expected: '1',
        input: 'nm1'
      },
      {
        expected: '11 / 34',
        input: '1134568904'
      },
      {
        expected: '11 / 5',
        input: '115'
      }
    ];

    test.forEach(({ expected, input }) =>
      expect(FormatterModel.monthYearFormatter({ newValue: input })).toEqual(expected)
    );
  });
});
