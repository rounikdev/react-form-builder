import { ValidatorModel } from '../ValidatorModel';

const requiredValidationTestCases = [
  {
    expected: { errors: [{ text: 'requiredField' }], valid: false },
    validator: ValidatorModel.createRequiredValidator(),
    value: false
  },
  {
    expected: { errors: [{ text: 'requiredField' }], valid: false },
    value: null
  },
  {
    expected: { errors: [{ text: 'requiredField' }], valid: false },
    value: undefined
  },
  {
    expected: { errors: [{ text: 'requiredField' }], valid: false },
    value: NaN
  },
  {
    expected: { errors: [{ text: 'requiredField' }], valid: false },
    value: 0
  },
  {
    expected: { errors: [], valid: true },
    value: {}
  },
  {
    expected: { errors: [], valid: true },
    value: true
  },
  {
    expected: { errors: [], valid: true },
    value: 5
  },
  {
    expected: { errors: [], valid: true },
    value: 'hi'
  }
];

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
          testCase.message
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
          testCase.message
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
              substitutes: ['2019-04-06'],
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
        ValidatorModel.createMaxDateValidator(testCase.max, testCase.message)(testCase.value)
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
              substitutes: ['2019-04-06'],
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
        ValidatorModel.createMinDateValidator(testCase.min, testCase.message)(testCase.value)
      ).toEqual(testCase.expected);
    });
  });

  it('createMaxNumberValidator', () => {
    const testCases = [
      { expected: { errors: [], valid: true }, max: 100, value: '100' },
      { expected: { errors: [], valid: true }, max: 100, value: '99' },
      { expected: { errors: [], valid: true }, max: 100.99, value: '100.98' },
      {
        expected: {
          errors: [
            {
              substitutes: ['100'],
              text: 'notMoreThanXNumber'
            }
          ],
          valid: false
        },
        max: 100,
        message: 'notMoreThanXNumber',
        value: '101'
      },
      {
        expected: {
          errors: [
            {
              substitutes: ['99.99'],
              text: 'notMoreThanXNumber'
            }
          ],
          valid: false
        },
        max: 99.99,
        message: 'notMoreThanXNumber',
        value: '100.00'
      }
    ];

    testCases.forEach((testCase) => {
      expect(
        ValidatorModel.createMaxNumberValidator(testCase.max, testCase.message)(testCase.value)
      ).toEqual(testCase.expected);
    });
  });

  it('createMinNumberValidator', () => {
    const testCases = [
      { expected: { errors: [], valid: true }, min: 100, value: '100' },
      { expected: { errors: [], valid: true }, min: 100, value: '130' },
      { expected: { errors: [], valid: true }, min: 100.98, value: '100.99' },
      {
        expected: {
          errors: [
            {
              substitutes: ['100'],
              text: 'notLessThanXNumber'
            }
          ],
          valid: false
        },
        min: 100,
        message: 'notLessThanXNumber',
        value: '99'
      },
      {
        expected: {
          errors: [
            {
              substitutes: ['99.99'],
              text: 'notLessThanXNumber'
            }
          ],
          valid: false
        },
        min: 99.99,
        message: 'notLessThanXNumber',
        value: '99.98'
      }
    ];

    testCases.forEach((testCase) => {
      expect(
        ValidatorModel.createMinNumberValidator(testCase.min, testCase.message)(testCase.value)
      ).toEqual(testCase.expected);
    });
  });

  it('createCharacterSetValidator', () => {
    const testCases = [
      {
        characterSet: /^[A-Za-z0-9 ]*$/,
        expected: { errors: [], valid: true },
        value: ''
      },
      {
        characterSet: /^[A-Za-z0-9 ]*$/,
        expected: { errors: [], valid: true },
        value: 'a'
      },
      {
        characterSet: /^[A-Za-z0-9 ]*$/,
        expected: { errors: [{ text: 'containsInvalidCharacters' }], valid: false },
        message: 'containsInvalidCharacters',
        value: '?'
      }
    ];

    testCases.forEach((testCase) => {
      expect(
        ValidatorModel.createCharacterSetValidator(
          testCase.characterSet,
          testCase.message
        )(testCase.value)
      ).toEqual(testCase.expected);
    });
  });

  it('requiredValidator', () => {
    requiredValidationTestCases.forEach((testCase) => {
      const validityCheck = ValidatorModel.requiredValidator(testCase.value);

      expect(validityCheck).toEqual(testCase.expected);
    });
  });

  it('createRequiredValidator', () => {
    const requiredValidator = ValidatorModel.createRequiredValidator('requiredField');

    ValidatorModel.createRequiredValidator();

    [
      ...requiredValidationTestCases,
      {
        expected: { errors: [{ text: 'requiredCreditCard' }], valid: false },
        validator: ValidatorModel.createRequiredValidator('requiredCreditCard'),
        value: ''
      }
    ].forEach((testCase) => {
      const validator = testCase.validator || requiredValidator;
      const validityCheck = validator(testCase.value);

      expect(validityCheck).toEqual(testCase.expected);
    });
  });

  it('createExactLengthValidator', () => {
    const testCases = [
      {
        expected: { errors: [], valid: true },
        validator: ValidatorModel.createExactLengthValidator(0),
        value: 'a'
      },
      {
        expected: { errors: [], valid: true },
        validator: ValidatorModel.createExactLengthValidator(-1),
        value: 'a'
      },
      {
        expected: { errors: [], valid: true },
        validator: ValidatorModel.createExactLengthValidator(2),
        value: 'ab'
      },
      {
        expected: { errors: [{ substitutes: ['5'], text: 'enterXCharacters' }], valid: false },
        validator: ValidatorModel.createExactLengthValidator(5, 'enterXCharacters'),
        value: 'a'
      },
      {
        expected: { errors: [{ substitutes: ['3'], text: 'enterXCharacters' }], valid: false },
        validator: ValidatorModel.createExactLengthValidator(5, 'enterXCharacters', 3),
        value: 'a'
      }
    ];

    testCases.forEach(({ expected, validator, value }) => {
      expect(validator(value)).toEqual(expected);
    });
  });

  it('composeValidators', () => {
    const testCases = [
      {
        expected: { errors: [], valid: true },
        validatorA: ValidatorModel.createMaxLengthValidator(35),
        validatorB: ValidatorModel.createCharacterSetValidator(/^[A-Za-z0-9 ]*$/),
        value: ''
      },
      {
        expected: {
          errors: [
            {
              substitutes: ['3'],
              text: 'notMoreThanXCharacters'
            }
          ],
          valid: false
        },
        validatorA: ValidatorModel.createMaxLengthValidator(3, 'notMoreThanXCharacters'),
        validatorB: ValidatorModel.createCharacterSetValidator(/^[A-Za-z0-9 ]*$/),
        value: 'abcd'
      },
      {
        expected: {
          errors: [{ text: 'containsInvalidCharacters' }],
          valid: false
        },
        validatorA: ValidatorModel.createMaxLengthValidator(3),
        validatorB: ValidatorModel.createCharacterSetValidator(
          /^[A-Za-z0-9 ]*$/,
          'containsInvalidCharacters'
        ),
        value: 'ab?'
      },
      {
        expected: {
          errors: [
            {
              text: 'requiredField'
            }
          ],
          valid: false
        },
        validatorA: ValidatorModel.requiredValidator,
        validatorB: ValidatorModel.createMinDateValidator('2019-04-06'),
        value: ''
      },
      {
        expected: {
          errors: [
            {
              substitutes: ['2019-04-06'],
              text: 'notLessThanXDate'
            }
          ],
          valid: false
        },
        validatorA: ValidatorModel.createRequiredValidator('requiredField'),
        validatorB: ValidatorModel.createMinDateValidator('2019-04-06', 'notLessThanXDate'),
        value: '2019-04-05'
      },
      {
        expected: {
          errors: [],
          valid: true
        },
        validatorA: ValidatorModel.createRequiredValidator('requiredField'),
        validatorB: ValidatorModel.createMinDateValidator('2019-04-06'),
        value: '2019-06-06'
      }
    ];

    testCases.forEach(async (testCase) => {
      const validityCheck = await ValidatorModel.composeValidators(
        testCase.validatorA,
        testCase.validatorB
      )(testCase.value);

      expect(validityCheck).toEqual(testCase.expected);
    });
  });

  it('creditCardValidator', () => {
    const testCases = [
      {
        expected: { errors: [], valid: true },
        value: '0012  2344  2323  0023'
      },
      {
        expected: { errors: [], valid: true },
        value: ''
      },
      {
        expected: { errors: [{ text: 'invalidCreditCard' }], valid: false },
        value: 'a'
      }
    ];

    testCases.forEach(({ expected, value }) => {
      expect(ValidatorModel.creditCardValidator(value)).toEqual(expected);
    });
  });

  it('monthYearValidator', () => {
    const testCases = [
      {
        expected: { errors: [], valid: true },
        value: '11 / 18'
      },
      {
        expected: { errors: [], valid: true },
        value: ''
      },
      {
        expected: { errors: [{ text: 'invalidMonthYear' }], valid: false },
        value: '13 / 18'
      },
      {
        expected: { errors: [{ text: 'invalidMonthYear' }], valid: false },
        value: 'a'
      }
    ];

    testCases.forEach(({ expected, value }) => {
      expect(ValidatorModel.monthYearValidator(value)).toEqual(expected);
    });
  });
});
