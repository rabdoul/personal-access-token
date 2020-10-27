import { isValueInError } from '../InputLength';

describe('isValueInError', () => {
  type Case = { value?: number | string; min?: number; expected: boolean };
  const cases = [
    { value: undefined, min: 10, expected: true },
    { value: '', min: 10, expected: true },
    { value: 5, min: 10, expected: true },
    { value: 15, min: 10, expected: false },
    { value: 15, min: undefined, expected: false },
    { value: undefined, min: undefined, expected: true },
    { value: '', min: undefined, expected: true }
  ];

  cases.forEach(({ value, min, expected }) => {
    it(`should return ${expected} if value=${value} and min=${min}`, () => {
      expect(isValueInError(value, min)).toBe(expected);
    });
  });
});
