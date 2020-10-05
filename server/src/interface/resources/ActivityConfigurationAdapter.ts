export default class ActivityConfigurationAdapter {

    toConfig(activityConfiguration: any) {
        return { conditions: activityConfiguration.eligibleConditions.map((it: any) => this.toCondition(it)) }
    }

    private toCondition(conditionConfig: any) {
        return {
            reference: conditionConfig.leftOperand,
            multipleOperator: conditionConfig.eligibleListOperator.map((lo: number) => ListOperator[lo]),
            operators: conditionConfig.eligibleOperator.map((o: number) => Operator[o]),
            valueType: ValueType[conditionConfig.conditionType],
            valueSource: ValueSource[conditionConfig.rightOperandBindingSource],
            predefinedValues: []
        };
    }
}

enum ListOperator {
    None = 0,
    AtLeastOne = 1
}

enum Operator {
    Equals = 0,
    Above = 1,
    Below = 2,
    Different = 3,
    Contains = 4,
    IsInList = 5,
}

enum ValueType {
    String = 0,
    Numeric = 1,
    Bool = 2,
    StringList = 3,
    IntegerList = 4
}

enum ValueSource {
    None,
    NestingGroup,
    CuttingGroup,
    ProductCategory
}