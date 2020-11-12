import React from 'react';
import DropDownSearch from '@lectra/dropdownsearch';
import { fetchData } from 'raspberry-fetch';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';

import { useAccessToken } from '../base/Authentication';
import { LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import { useUIDispatch } from '../UIState';
import DropDownSearchRenderer from './common/DropDownSearchRenderer';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';
import { AffectCuttingLine } from './AffectCuttingLineRule';

function useProductionLines() {
  const token = useAccessToken();
  const { data: productionLines } = useQuery('production-lines', () => fetchData(token, 'production-lines'));
  return productionLines;
}

const AffectCuttingLineODRule = () => <Rule activityId={'affect-cutting-line'}>{props => <AffectCuttingLineResultODForm {...props} />}</Rule>;

const AffectCuttingLineResultODForm: React.FC<StatementResultFormProps<AffectCuttingLine>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const productionLines = useProductionLines() || [];
  const urls = useHelpUrls('PP_AFFECT_LINE_PRODUCTION_LINE');

  function handleCuttingLineChange(item?: { value: string }) {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'affect-cutting-line', statementIndex, attribute: 'lineId', value: item?.value });
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
        placeholder={formatMessage({ id: 'common.search' })}
        width={200}
      />
    </Form>
  );
};

export default AffectCuttingLineODRule;
