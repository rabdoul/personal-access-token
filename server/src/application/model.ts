import { UnitConfig } from 'cutting-room-units'

export enum ListOperator { None, AtLeastOne }

export enum Operator { Equals, Above, Below, Different, Contains, IsInList }

export enum ValueType { String, Numeric, Bool, StringList, IntegerList }

export enum ValueSource { None, NestingGroup, CuttingGroup, ProductCategory, SpreadingGroup, Spreader, Cutter, Backlog }

export type ValueUnit = { metric: UnitConfig, imperial: UnitConfig }

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