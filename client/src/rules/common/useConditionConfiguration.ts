import { useIntl } from 'react-intl';
import { Condition, ActivityConfiguration, ValueSource, ValueType, ConditionDefinition } from '../../model';
import { useAccessToken } from '../../base/Authentication';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

const computeConditionValueType = (conditionDefinition?: ConditionDefinition) => {
  if (!conditionDefinition) {
    return 'text';
  } else if (conditionDefinition.valueSource === 'None' && conditionDefinition.predefinedValueSource.length === 0) {
    return conditionDefinition.valueType === 'Numeric' ? 'number' : 'text';
  }
  return 'list';
};

const useProductCategories = () => {
  const accessToken = useAccessToken();
  const { data } = useQuery('product-categories', () => fetchData(accessToken, `product-categories`));
  return data;
};

function useListItems(conditionDefinition?: ConditionDefinition) {
  const { formatMessage } = useIntl();
  const productCategoryItems = useProductCategories();
  const predifinedItems = conditionDefinition?.predefinedValueSource.map(it => ({ label: formatMessage({ id: it }), value: it })) || [];
  if (conditionDefinition?.valueSource === 'ProductCategory') {
    return productCategoryItems;
  } else if (conditionDefinition?.valueSource === 'NestingGroup') {
    return [];
  } else if (conditionDefinition?.valueSource === 'CuttingGroup') {
    return [];
  } else {
    return predifinedItems;
  }
}

const useConditionConfiguration = (condition: Condition, activityConfiguration: ActivityConfiguration) => {
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
  return { references, operators, type, listItems, multipleOperatorItems };
};

export default useConditionConfiguration;
