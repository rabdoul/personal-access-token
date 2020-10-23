import React from 'react';
import DropDownSearch from '@lectra/dropdownsearch';
import { fetchData } from 'raspberry-fetch';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useAccessToken } from '../base/Authentication';
import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';

export interface AffectCuttingLine extends StatementResult {
  lineId?: string;
}

function useProductionLines() {
  const token = useAccessToken();
  const { data: productionLines } = useQuery('production-lines', () => fetchData(token, 'production-lines'));
  return productionLines;
}

const AffectCuttingLineRule = () => <Rule activityId={'affect-cutting-line'}>{props => <AffectCuttingLineResultForm {...props} />}</Rule>;

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
