import React from 'react';
import { useIntl } from 'react-intl';
import Checkbox from '@lectra/checkbox';

import { StatementResult } from '../model';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';
import { useUIDispatch } from '../UIState';

export interface Plot extends StatementResult {
  canPlot: boolean;
}

const PlotRule: React.FC = () => <Rule activityId={'plot'}>{props => <PlotForm {...props} />}</Rule>;

const PlotForm: React.FC<StatementResultFormProps<Plot>> = ({ statementIndex, statementResult, disabled }) => {
  const dispatch = useUIDispatch();
  const { formatMessage } = useIntl();

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <Checkbox
        disabled={disabled}
        label={formatMessage({ id: 'rule.plot.enable.automatic.plotting' })}
        checked={statementResult.canPlot ?? false}
        onChange={value => {
          dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'plot', statementIndex: statementIndex, attribute: 'canPlot', value });
        }}
        xlabel="enableAutomaticPlot"
        tickSize={13}
      />
    </Form>
  );
};

export default PlotRule;
