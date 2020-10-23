import React from 'react';
import { useIntl } from 'react-intl';

import { CheckBoxWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';

export interface RollAssignment extends StatementResult {
  rollAllocationRequired: boolean;
}

const RollAssignmentRule = () => <Rule activityId={'after-nesting-roll-allocation'}>{props => <RollAssignmentResultForm {...props} />}</Rule>;

const RollAssignmentResultForm: React.FC<StatementResultFormProps<RollAssignment>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  return (
    <Form>
      <CheckBoxWithHelpTooltip
        disabled={disabled}
        label={formatMessage({ id: 'request.roll.allocation' })}
        checked={statementResult.rollAllocationRequired!}
        onChange={value => dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'after-nesting-roll-allocation', statementIndex, attribute: 'rollAllocationRequired', value })}
        xlabel="rollAllocationRequired"
        tickSize={13}
        helpUrl={useHelpUrls('PP_ROLL_ASK_FOR_REF')[0]}
      />
    </Form>
  );
};

export default RollAssignmentRule;
