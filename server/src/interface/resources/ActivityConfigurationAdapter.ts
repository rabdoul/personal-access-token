import { Activity } from './ActivitiesResource';

export default class ActivityConfigurationAdapter {

    toConfig(activity: Activity) {
        return { conditions: activity.eligibleConditions.map((it: any) => this.toCondition(it)) }
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

enum ListOperator { None, AtLeastOne }

enum Operator { Equals, Above, Below, Different, Contains, IsInList }

enum ValueType { String, Numeric, Bool, StringList, IntegerList }

enum ValueSource { None, NestingGroup, CuttingGroup, ProductCategory }