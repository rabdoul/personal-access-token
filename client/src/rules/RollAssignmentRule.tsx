import React from 'react';

import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { StatementResult } from '../model';
import { useIntl } from 'react-intl';
import { useHelpUrls } from '../base/Help';
import { Form, FormLine } from './common/styles';
import Checkbox from '@lectra/checkbox';
import useRuleValidator from './common/useRuleValidator';

export interface RollAssignment extends StatementResult {
  rollAllocationRequired: boolean;
}

const RollAssignmentRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('after-nesting-roll-allocation');
  const activityConfiguration = useActivityConfiguration('after-nesting-roll-allocation');
  useRuleValidator('after-nesting-roll-allocation', rule);

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {props => <RollAssignmentResultForm {...props} />}
    </Rule>
  );
};

const RollAssignmentResultForm: React.FC<StatementResultFormProps<RollAssignment>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine helpUrl={useHelpUrls('PP_ROLL_ASK_FOR_REF')[0]}>
        <Checkbox
          disabled={disabled}
          label={formatMessage({ id: 'request.roll.allocation' })}
          checked={statementResult.rollAllocationRequired!}
          onChange={value => dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'after-nesting-roll-allocation', statementIndex, attribute: 'rollAllocationRequired', value })}
          xlabel="rollAllocationRequired"
          tickSize={13}
        />
      </FormLine>
    </Form>
  );
};

export default RollAssignmentRule;
