export type Activity = { id: string; order: number; enabled: boolean };
export type ActivityConfiguration = { id: string; conditions: ConditionDefinition[] };

export type ConditionDefinition = {
  reference: string;
  multipleOperators: ListOperator[];
  operators: Operator[];
  valueType: ValueType;
  valueSource: ValueSource;
  predefinedValueSource: string[];
};

type ListOperator = 'None' | 'AtLeastOne';

export type Operator = 'Equals' | 'Above' | 'Below' | 'Different' | 'Contains' | 'IsInList';

export type ValueType = 'String' | 'Numeric' | 'Bool' | 'StringList' | 'IntegerList';

export type ValueSource = 'None' | 'NestingGroup' | 'CuttingGroup' | 'ProductCategory';

export interface StatementResult {}

export type Condition = Partial<{
  reference: string;
  multipleOperator: ListOperator;
  operator: Operator;
  value: any;
}>;

export type Statement<T extends StatementResult> = {
  conditions: Condition[];
  result: Partial<T>;
};

export type ActivityRule<T extends StatementResult> = Statement<T>[];
