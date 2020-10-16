import React from 'react';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import CheckBox from '@lectra/checkbox';

import { StatementResult } from '../model';
import { useUIState, useUIDispatch } from '../UIState';
import Rule from './common/Rule';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import { Form, FormLine } from './common/styles';
import { useIntl } from 'react-intl';

export interface Publish extends StatementResult {
  automaticallyPublish: boolean;
}

export const PublishRule: React.FC = () => {
  const publish = useRule('publish');
  const { editMode } = useUIState();
  const activityConfiguration = useActivityConfiguration('publish');
  if (publish !== undefined && activityConfiguration !== undefined) {
    return (
      <Rule rule={publish} activityConfiguration={activityConfiguration} disabled={!editMode}>
        {(statementIndex, result) => <PublishForm statementIndex={statementIndex} result={result} editMode={editMode} />}
      </Rule>
    );
  } else {
    return <StepDescription />;
  }
};

const PublishForm: React.FC<{ statementIndex: number; result: Partial<Publish>; editMode: boolean }> = ({ statementIndex, result, editMode }) => {
  const dispatch = useUIDispatch();
  const { formatMessage } = useIntl();
  const onChange = (value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'publish', statementIndex: statementIndex, attribute: 'automaticallyPublish', value: value });
  };
  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine>
        <label htmlFor={'TBD'}>{formatMessage({ id: 'rule.publish.publish.cutting.job' })}</label>
        <CheckBox
          disabled={!editMode}
          label={formatMessage({ id: 'rule.publish.enable.automatic.publishing' })}
          checked={result.automaticallyPublish ?? true}
          onChange={onChange}
          xlabel="stopOnOutOfRangeWarning"
          tickSize={13}
        />
      </FormLine>
    </Form>
  );
};
