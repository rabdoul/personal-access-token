import { valueUnitFromUnitType } from "../application/model";

describe('valueUnitFromUnitType', () => {
    const cases = [
        {
            unitType: 'MarkerWeight', expected: undefined
        },
        {
            unitType: 'MarkerLength', expected: {
                metric: { unit: 'm', decimalScale: 3 },
                imperial: { unit: 'yd', decimalScale: 3 }
            }
        },
        {
            unitType: 'MarkerWidth', expected: {
                metric: { unit: 'cm', decimalScale: 1 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'BatchWidth', expected: {
                metric: { unit: 'cm', decimalScale: 1 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'BatchLength', expected: {
                metric: { unit: 'm', decimalScale: 3 },
                imperial: { unit: 'yd', decimalScale: 3 }
            }
        },
        {
            unitType: 'BatchSelvage', expected: {
                metric: { unit: 'mm', decimalScale: 0 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'MaterialWidth', expected: {
                metric: { unit: 'cm', decimalScale: 1 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'MaterialThickness', expected: {
                metric: { unit: 'mm', decimalScale: 2 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'SpacingConstraint', expected: {
                metric: { unit: 'mm', decimalScale: 2 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'BlockingConstraint', expected: {
                metric: { unit: 'cm', decimalScale: 2 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'GroupsProcessing', expected: {
                metric: { unit: 'cm', decimalScale: 1 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'MotifOffSet', expected: {
                metric: { unit: 'mm', decimalScale: 1 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'MotifStep', expected: {
                metric: { unit: 'mm', decimalScale: 1 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'NotchProtection', expected: {
                metric: { unit: 'mm', decimalScale: 2 },
                imperial: { unit: 'in', decimalScale: 2 }
            }
        },
        {
            unitType: 'DaoLibMeasure', expected: {
                metric: { unit: 'm', decimalScale: 3 },
                imperial: { unit: 'yd', decimalScale: 3 }
            }
        },
        {
            unitType: 'AreaDensity', expected: {
                metric: { unit: 'kg/m2', decimalScale: 3 },
                imperial: { unit: 'lb/ft2', decimalScale: 3 }
            }
        }
    ];

    cases.forEach(({ unitType, expected }) => {
        it(`should return unitConfig if unitType=${unitType}`, () => {
            expect(valueUnitFromUnitType(unitType)).toEqual(expected);
        });
    });
});