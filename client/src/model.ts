export type Activity = { id: string; order: number; enabled: boolean };
export type ActivityConfiguration = { conditions: ConditionDef[] };

export type ConditionDef = {
  reference: string;
  multipleOperators: ListOperator[];
  operators: Operator[];
  valueType: ValueType;
  valueSource: ValueSource;
};

type ListOperator = 'None' | 'AtLeastOne';

export type Operator = 'Equals' | 'Above' | 'Below' | 'Different' | 'Contains' | 'IsInList';

export type ValueType = 'String' | 'Numeric' | 'Bool' | 'StringList' | 'IntegerList';

export type ValueSource = 'None' | 'NestingGroup' | 'CuttingGroup' | 'ProductCategory';

export interface RuleResult {}

export interface Sequencing extends RuleResult {
  splitList: boolean;
  firstSubListSize: number;
}

export interface ValidateMTMProduct extends RuleResult {
  stopOnOutOfRangeWarning: boolean;
  stopOnIncorrectValueWarning: boolean;
}

export interface AssociateCuttingRequirements extends RuleResult {
  requirementId?: string;
}

export type Condition = Partial<{
  reference: string;
  multipleOperator: ListOperator;
  operator: Operator;
  value: any;
}>;

export type Statement<T extends RuleResult> = {
  conditions: Condition[];
  result: Partial<T>;
};

export type ActivityRule<T extends RuleResult> = Statement<T>[];
