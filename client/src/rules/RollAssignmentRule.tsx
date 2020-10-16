import React from 'react';

import useRule from './common/useRule';
import { useUIDispatch, useUIState } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule from './common/Rule';
import { StatementResult } from '../model';
import { useIntl } from 'react-intl';
import { useHelpUrls } from '../base/Help';
import { Form, FormLine } from './common/styles';
import Checkbox from '@lectra/checkbox';

export interface RollAssignment extends StatementResult {
  rollAllocationRequired: boolean;
}

const RollAssignmentRule = () => {
  const { editMode } = useUIState();
  const rule = useRule('after-nesting-roll-allocation');
  const activityConfiguration = useActivityConfiguration('after-nesting-roll-allocation');

  if (!rule || !activityConfiguration) {
    return null;
  }

  return (
    <Rule activityConfiguration={activityConfiguration} rule={rule} disabled={!editMode}>
      {(statementIndex, result) => <RollAssignmentResultForm rollAssignment={result} statementIndex={statementIndex} disabled={!editMode} />}
    </Rule>
  );
};

type FormProps = {
  rollAssignment: Partial<RollAssignment>;
  statementIndex: number;
  disabled: boolean;
};

const RollAssignmentResultForm: React.FC<FormProps> = ({ rollAssignment, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();
  const urls = useHelpUrls('PP_ROLL_');

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine helpUrl={urls[0]}>
        <Checkbox
          disabled={disabled}
          label={formatMessage({ id: 'request.roll.allocation' })}
          checked={rollAssignment.rollAllocationRequired!}
          onChange={value => dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'after-nesting-roll-allocation', statementIndex, attribute: 'rollAllocationRequired', value })}
          xlabel="rollAllocationRequired"
          tickSize={13}
        />
      </FormLine>
    </Form>
  );
};

export default RollAssignmentRule;
