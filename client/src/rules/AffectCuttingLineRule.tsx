import React from 'react';

import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { useQuery } from 'react-query';
import { fetchData } from 'raspberry-fetch';
import { useAccessToken } from '../base/Authentication';
import { Form } from './common/styles';
import DropDownSearch from '@lectra/dropdownsearch';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import { useIntl } from 'react-intl';
import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import useRuleValidator from './common/useRuleValidator';

export interface AffectCuttingLine extends StatementResult {
  lineId?: string;
}

function useProductionLines() {
  const token = useAccessToken();
  const { data: productionLines } = useQuery('production-lines', () => fetchData(token, 'production-lines'));
  return productionLines;
}

const AffectCuttingLineRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('affect-cutting-line');
  const activityConfiguration = useActivityConfiguration('affect-cutting-line');
  useRuleValidator('affect-cutting-line', rule);

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <AffectCuttingLineResultForm {...props} />}
    </Rule>
  );
};

const AffectCuttingLineResultForm: React.FC<StatementResultFormProps<AffectCuttingLine>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const productionLines = useProductionLines();
  const urls = useHelpUrls('PP_AFFECT_LINE_PRODUCTION_LINE');

  function handleCuttingLineChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'affect-cutting-line', statementIndex, attribute: 'lineId', value: item?.value });
  }
  if (!productionLines) {
    return null;
  }
  return (
    <Form onSubmit={e => e.preventDefault()}>
      <LabelWithHelpTooltip helpUrl={urls[0]}>{formatMessage({ id: 'rule.affect.cutting.line.production.line' })}</LabelWithHelpTooltip>
      <DropDownSearch
        data-xlabel="production-line"
        data-xvalue={statementResult.lineId ?? 'none'}
        listItems={productionLines}
        value={statementResult.lineId}
        onChange={handleCuttingLineChange}
        customRenderSelection={(item: any) => <DropDownSearchRenderer item={item} disabled={disabled} onDelete={() => handleCuttingLineChange()} />}
        disabled={disabled}
        placeholder="Search"
        width={200}
      />
    </Form>
  );
};

export default AffectCuttingLineRule;
