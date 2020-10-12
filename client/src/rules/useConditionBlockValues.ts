import { useIntl } from 'react-intl';
import { Condition, ActivityConfiguration, ValueSource, ValueType } from '../model';
import { useAccessToken } from '../base/Authentication';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';

const getType = (valueType: ValueType | undefined, valueSource: ValueSource | undefined) => {
  if (!valueSource) return 'text';
  else if (valueSource === 'None') return valueType === 'Numeric' ? 'number' : 'text';
  return 'list';
};

const useProductCategories = () => {
  const accessToken = useAccessToken();

  const { data } = useQuery('product-categories', () => fetchData(accessToken, `product-categories`));

  return data;
};

const useConditionBlockValues = (condition: Condition, activityConfiguration: ActivityConfiguration) => {
  const { formatMessage } = useIntl();
  const listItems = useProductCategories();

  const activityReferences = activityConfiguration.conditions.map(it => ({ label: formatMessage({ id: it.reference }), value: it.reference }));
  const conditionDefinition = activityConfiguration.conditions.find(it => it.reference === condition.reference);
  const operators = conditionDefinition?.operators.map(it => ({ label: formatMessage({ id: `operator.${it.toLowerCase()}` }), value: it })) || [];
  const multipleOperatorItems =
    conditionDefinition && !conditionDefinition.multipleOperators.every(it => it === 'None')
      ? conditionDefinition.multipleOperators.map(it => ({ label: formatMessage({ id: `operator.${it.toLowerCase()}` }), value: it }))
      : undefined;
  const type = getType(conditionDefinition?.valueType, conditionDefinition?.valueSource);

  return { activityReferences, operators, type, listItems, multipleOperatorItems };
};

export default useConditionBlockValues;
