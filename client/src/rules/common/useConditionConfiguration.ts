import { useIntl } from 'react-intl';
import { Condition, ActivityConfiguration, ValueSource, ValueType, ConditionDefinition } from '../../model';
import { useAccessToken } from '../../base/Authentication';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

function computeConditionValueType(conditionDefinition?: ConditionDefinition) {
  if (!conditionDefinition) {
    return 'text';
  } else if (conditionDefinition.valueSource === 'None' && conditionDefinition.predefinedValueSource.length === 0) {
    return conditionDefinition.valueType === 'Numeric' ? 'number' : 'text';
  }
  return 'list';
}

function useProductCategories() {
  const accessToken = useAccessToken();
  const { data } = useQuery('product-categories', () => fetchData(accessToken, `product-categories`));
  return data;
}

function useNestingGroups() {
  const accessToken = useAccessToken();
  const { data } = useQuery('material-nesting-groups', () => fetchData(accessToken, `material-nesting-groups`));
  return data;
}

function useCuttingGroups() {
  const accessToken = useAccessToken();
  const { data } = useQuery('material-cutting-groups', () => fetchData(accessToken, `material-cutting-groups`));
  return data;
}

function useSpreadingGroups() {
  const accessToken = useAccessToken();
  const { data } = useQuery('material-spreading-groups', () => fetchData(accessToken, `material-spreading-groups`));
  return data;
}

function useListItems(conditionDefinition?: ConditionDefinition) {
  const { formatMessage } = useIntl();
  const productCategoryItems = useProductCategories();
  const nestingGroupItems = useNestingGroups();
  const cuttingGroupItems = useCuttingGroups();
  const spreadingGroupItems = useSpreadingGroups();
  const predifinedItems = conditionDefinition?.predefinedValueSource.map(it => ({ label: formatMessage({ id: it }), value: it })) || [];

  if (conditionDefinition?.valueSource === 'ProductCategory') {
    return productCategoryItems;
  } else if (conditionDefinition?.valueSource === 'NestingGroup') {
    return nestingGroupItems;
  } else if (conditionDefinition?.valueSource === 'CuttingGroup') {
    return cuttingGroupItems;
  } else if (conditionDefinition?.valueSource === 'SpreadingGroup') {
    return spreadingGroupItems;
  } else {
    return predifinedItems;
  }
}

export default function useConditionConfiguration(condition: Condition, activityConfiguration: ActivityConfiguration) {
  const { formatMessage } = useIntl();
  const references = activityConfiguration.conditions.map(it => ({ label: formatMessage({ id: it.reference }), value: it.reference }));
  const conditionDefinition = activityConfiguration.conditions.find(it => it.reference === condition.reference);
  const operators = conditionDefinition?.operators.map(it => ({ label: formatMessage({ id: `operator.${it.toLowerCase()}` }), value: it })) || [];
  const multipleOperatorItems =
    conditionDefinition && !conditionDefinition.multipleOperators.every(it => it === 'None')
      ? conditionDefinition.multipleOperators.map(it => ({ label: formatMessage({ id: `operator.${it.toLowerCase()}` }), value: it }))
      : undefined;
  const type = computeConditionValueType(conditionDefinition);
  const listItems = useListItems(conditionDefinition);
  return { multipleOperatorItems, references, operators, type, listItems };
}
