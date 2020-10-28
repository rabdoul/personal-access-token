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
    None, MarkerLength, MarkerWidth, BatchWidth, BatchLength, BatchSelvage, MaterialWidth, MaterialThickness, SpacingConstraint, BlockingConstraint, GroupsProcessing, MotifOffSet, MotifStep, NotchProtection, DaoLibMeasure, AreaDensityUnit
}

export function valueUnitFromUnitType(unitType: string): ValueUnit | undefined {
    switch (unitType) {
        case 'MarkerLength' : return {
            metric: { decimalScale: 3, unit: 'm' },
            imperial: { decimalScale: 3, unit: 'yd' }
        }
    }

}