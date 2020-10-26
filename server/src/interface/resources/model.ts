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