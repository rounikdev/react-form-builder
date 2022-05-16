import { flattenFormArrayState, flattenFormObjectState, flattenFormState } from '../';

describe('Form services', () => {
  it('flattenFormState with valid data', () => {
    const result = flattenFormState({ valid: true, value: { firstName: 'Ivan' } }, [
      'lastName',
      { valid: true, value: 'Ivanov' }
    ]);

    expect(result).toEqual({ valid: true, value: { firstName: 'Ivan', lastName: 'Ivanov' } });
  });

  it('flattenFormState with invalid data', () => {
    const result = flattenFormState({ valid: true, value: { firstName: 'Ivan' } }, [
      'lastName',
      { valid: false, value: 'Ivanov' }
    ]);

    expect(result).toEqual({ valid: false, value: { firstName: 'Ivan', lastName: 'Ivanov' } });
  });

  it('flattenFormObjectState with valid data', () => {
    const result = flattenFormObjectState({
      firstName: { valid: true, value: 'Ivan' },
      lastName: { valid: true, value: 'Ivanov' }
    });

    expect(result).toEqual({ valid: true, value: { firstName: 'Ivan', lastName: 'Ivanov' } });
  });

  it('flattenFormObjectState with invalid data', () => {
    const result = flattenFormObjectState({
      firstName: { valid: true, value: 'Ivan' },
      lastName: { valid: false, value: 'Ivanov' }
    });

    expect(result).toEqual({ valid: false, value: { firstName: 'Ivan', lastName: 'Ivanov' } });
  });

  it('flattenFormArrayState with valid data', () => {
    const result = flattenFormArrayState({
      0: { valid: true, value: { firstName: 'Ivan', lastName: 'Ivanov' } },
      1: { valid: true, value: { firstName: 'Maria', lastName: 'Ignatova' } }
    });

    expect(result).toEqual({
      valid: true,
      value: [
        { firstName: 'Ivan', lastName: 'Ivanov' },
        { firstName: 'Maria', lastName: 'Ignatova' }
      ]
    });
  });

  it('flattenFormArrayState with invalid data', () => {
    const result = flattenFormArrayState({
      0: { valid: true, value: { firstName: 'Ivan', lastName: 'Ivanov' } },
      1: { valid: false, value: { firstName: 'Maria', lastName: 'Ignatova' } }
    });

    expect(result).toEqual({
      valid: false,
      value: [
        { firstName: 'Ivan', lastName: 'Ivanov' },
        { firstName: 'Maria', lastName: 'Ignatova' }
      ]
    });
  });
});
