export enum ListOperator { None, AtLeastOne }

export enum Operator { Equals, Above, Below, Different, Contains, IsInList }

export enum ValueType { String, Numeric, Bool, StringList, IntegerList }

export enum ValueSource { None, NestingGroup, CuttingGroup, ProductCategory, SpreadingGroup }

export type ValueUnit = { metric: { decimalScale: number, unit: string }, imperial: { decimalScale: number, unit: string } }

export type Condition = { reference: string; multipleOperator: ListOperator; operator: Operator; value: any; };

export type Statement = { conditions: Condition[], result: any }

export type ConditionDefinition = {
    reference: string;
    multipleOperators: ListOperator[];
    operators: Operator[];
    valueType: ValueType;
    valueUnit?: ValueUnit;
    valueSource: ValueSource;
};

/**
 * https://gitlab.lectra.com/CuttingRoom/CutPreparation.Applications/-/blob/master/Foundation.DataModel/ProductionRules/Configuration/ConditionConfiguration.cs#L97
 */
export enum UnitType {
    None, MarkerLength, MarkerWidth, BatchWidth, BatchLength, BatchSelvage, MaterialWidth, MaterialThickness, SpacingConstraint, BlockingConstraint, GroupsProcessing, MotifOffSet, MotifStep, NotchProtection, DaoLibMeasure, AreaDensity
}

export function valueUnitFromUnitType(unitType: string): ValueUnit | undefined {
    switch (unitType) {
        case 'DaoLibMeasure':
        case 'BatchLength':
        case 'MarkerLength': return {
            metric: { unit: 'm', decimalScale: 3 },
            imperial: { unit: 'yd', decimalScale: 3 }
        }
        case 'GroupsProcessing':
        case 'BatchWidth':
        case 'MaterialWidth':
        case 'MarkerWidth': return {
            metric: { unit: 'cm', decimalScale: 1 },
            imperial: { unit: 'in', decimalScale: 2 }
        }
        case 'NotchProtection':
        case 'SpacingConstraint':
        case 'MaterialThickness': return {
            metric: { unit: 'mm', decimalScale: 2 },
            imperial: { unit: 'in', decimalScale: 2 }
        }
        case 'MotifStep':
        case 'MotifOffSet': return {
            metric: { unit: 'mm', decimalScale: 1 },
            imperial: { unit: 'in', decimalScale: 2 }
        }
        case 'BlockingConstraint': return {
            metric: { unit: 'cm', decimalScale: 2 },
            imperial: { unit: 'in', decimalScale: 2 }
        }
        case 'BatchSelvage': return {
            metric: { unit: 'mm', decimalScale: 0 },
            imperial: { unit: 'in', decimalScale: 2 }
        }
        case 'AreaDensity': return {
            metric: { unit: 'kg/m2', decimalScale: 3 },
            imperial: { unit: 'lb/ft2', decimalScale: 3 }
        }
    }

}