import { useIntl } from 'react-intl';
import { Condition, ActivityConfiguration, ConditionDefinition } from '../../model';
import { useAccessToken } from '../../base/Authentication';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import { useUnitSystem } from '../../base/UserPreference';

function computeConditionValueType(conditionDefinition?: ConditionDefinition) {
  if (!conditionDefinition) {
    return 'text';
  } else if (conditionDefinition.valueSource === 'None' && conditionDefinition.valueType !== 'Bool' && conditionDefinition.predefinedValueSource.length === 0) {
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
  const booleanItems = [
    { label: formatMessage({ id: 'boolean.true' }), value: 'True' },
    { label: formatMessage({ id: 'boolean.false' }), value: 'False' }
  ];
  const predifinedItems = conditionDefinition?.predefinedValueSource.map(it => ({ label: formatMessage({ id: it }), value: it })) || [];

  switch (conditionDefinition?.valueSource) {
    case 'ProductCategory':
      return productCategoryItems;
    case 'NestingGroup':
      return nestingGroupItems;
    case 'CuttingGroup':
      return cuttingGroupItems;
    case 'SpreadingGroup':
      return spreadingGroupItems;
    default:
      return conditionDefinition?.valueType === 'Bool' ? booleanItems : predifinedItems;
  }
}

export default function useConditionConfiguration(condition: Condition, activityConfiguration: ActivityConfiguration) {
  const { formatMessage } = useIntl();
  const unitSystem = useUnitSystem();
  const references = activityConfiguration.conditions.map(it => ({ label: formatMessage({ id: it.reference }), value: it.reference }));
  const conditionDefinition = activityConfiguration.conditions.find(it => it.reference === condition.reference);
  const operators = conditionDefinition?.operators.map(it => ({ label: formatMessage({ id: `operator.${it.toLowerCase()}` }), value: it })) || [];
  const multipleOperatorItems =
    conditionDefinition && !conditionDefinition.multipleOperators.every(it => it === 'None')
      ? conditionDefinition.multipleOperators.map(it => ({ label: formatMessage({ id: `operator.${it.toLowerCase()}` }), value: it }))
      : undefined;
  const type = computeConditionValueType(conditionDefinition);
  const listItems = useListItems(conditionDefinition);
  const unitConfig = conditionDefinition?.valueUnit?.[unitSystem];
  return { multipleOperatorItems, references, operators, type, listItems, unitConfig };
}
