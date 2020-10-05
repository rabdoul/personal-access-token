export type Activity = { id: string; order: number; enabled: boolean };
export type ActivityConfiguration = { conditions: Condition[] };

type Condition = {
  reference: string;
  multipleOperator: ListOperator[];
  operators: Operator[];
  valueType: ValueType;
  valueSource: ValueSource;
};

type ListOperator = 'None' | 'AtLeastOne';
type Operator = 'Equals' | 'Above' | 'Below' | 'Different' | 'Contains' | 'IsInList';
type ValueType = 'String' | 'Numeric' | 'Bool' | 'StringList' | 'IntegerList';
type ValueSource = 'None' | 'NestingGroup' | 'CuttingGroup' | 'ProductCategory';

export type Sequencing = { splitCommandProducts: boolean; numberOfProductOrders: number };
export type ValidateMTMProduct = { stopOnOutOfRangeWarning: boolean; stopOnIncorrectValueWarning: boolean };
