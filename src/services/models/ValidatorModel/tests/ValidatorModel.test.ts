import { ValidatorModel } from '../ValidatorModel';

describe('ValidatorModel', () => {
  it('createMaxLengthValidator', () => {
    const testCases = [
      { expected: { errors: [], valid: true }, maxLength: -1, value: '' },
      { expected: { errors: [], valid: true }, maxLength: 0, value: '' },
      { expected: { errors: [], valid: true }, maxLength: 5, value: '' },
      { expected: { errors: [], valid: true }, maxLength: 5, value: 'abcde' },
      {
        expected: {
          errors: [
            {
              substitutes: ['5'],
              text: 'notMoreThanXCharacters'
            }
          ],
          valid: false
        },
        maxLength: 5,
        message: 'notMoreThanXCharacters',
        value: 'abcdef'
      }
    ];

    testCases.forEach((testCase) => {
      expect(
        ValidatorModel.createMaxLengthValidator(
          testCase.maxLength,
          testCase.message || ''
        )(testCase.value)
      ).toEqual(testCase.expected);
    });
  });

  it('createMinLengthValidator', () => {
    const testCases = [
      { expected: { errors: [], valid: true }, minLength: -1, value: '' },
      { expected: { errors: [], valid: true }, minLength: 0, value: '' },
      // value.length === 0 should be handled
      // by using the required prop on the field:
      { expected: { errors: [], valid: true }, minLength: 5, value: '' },
      { expected: { errors: [], valid: true }, minLength: 5, value: 'abcde' },
      { expected: { errors: [], valid: true }, minLength: 5, value: 'abcdef' },
      {
        expected: {
          errors: [
            {
              substitutes: ['5'],
              text: 'notLessThanXCharacters'
            }
          ],
          valid: false
        },
        minLength: 5,
        message: 'notLessThanXCharacters',
        value: 'abcd'
      }
    ];

    testCases.forEach((testCase) => {
      expect(
        ValidatorModel.createMinLengthValidator(
          testCase.minLength,
          testCase.message || ''
        )(testCase.value)
      ).toEqual(testCase.expected);
    });
  });

  it('createMaxDateValidator', () => {
    const testCases = [
      {
        expected: {
          errors: [
            {
              substitutes: ['2019-04-06T00:00:00.000Z'],
              text: 'notMoreThanXDate'
            }
          ],
          valid: false
        },
        max: '2019-04-06',
        message: 'notMoreThanXDate',
        value: '2021-04-23'
      },
      { expected: { errors: [], valid: true }, max: '2019-04-06', value: '' },
      {
        expected: {
          errors: [],
          valid: true
        },
        max: '2019-04-06',
        value: '2003-04-05'
      }
    ];

    testCases.forEach((testCase) => {
      expect(
        ValidatorModel.createMaxDateValidator(
          testCase.max,
          testCase.message || '',
          (timestamp: number) => new Date(timestamp).toISOString()
        )(testCase.value)
      ).toEqual(testCase.expected);
    });
  });

  it('createMinDateValidator', () => {
    const testCases = [
      { expected: { errors: [], valid: true }, min: '2019-04-06', value: '2021-04-23' },
      { expected: { errors: [], valid: true }, min: '2019-04-06', value: '' },
      {
        expected: {
          errors: [
            {
              substitutes: ['2019-04-06T00:00:00.000Z'],
              text: 'notLessThanXDate'
            }
          ],
          valid: false
        },
        message: 'notLessThanXDate',
        min: '2019-04-06',
        value: '2003-04-05'
      }
    ];

    testCases.forEach((testCase) => {
      expect(
        ValidatorModel.createMinDateValidator(
          testCase.min,
          testCase.message || '',
          (timestamp: number) => new Date(timestamp).toISOString()
        )(testCase.value)
      ).toEqual(testCase.expected);
    });
  });
});
