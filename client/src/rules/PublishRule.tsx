import React from 'react';
import { useIntl } from 'react-intl';

import { StatementResult } from '../model';
import { useUIState, useUIDispatch, ActivityId } from '../UIState';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import Rule, { StatementResultFormProps } from './common/Rule';
import { CheckBoxWithHelpTooltip, LabelWithHelpTooltip, useHelpUrls } from '../base/Help';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import { Form } from './common/styles';
import useRuleValidator from './common/useRuleValidator';

export interface Publish extends StatementResult {
  automaticallyPublish: boolean;
}

const PublishRule: React.FC = () => {
  const publish = useRule('publish');
  const { editMode } = useUIState();
  const activityConfiguration = useActivityConfiguration('publish');
  useRuleValidator(activityConfiguration?.id as ActivityId | undefined, publish);

  if (publish !== undefined && activityConfiguration !== undefined) {
    return (
      <Rule rule={publish} activityConfiguration={activityConfiguration} disabled={!editMode}>
        {props => <PublishForm {...props} />}
      </Rule>
    );
  } else {
    return <StepDescription />;
  }
};

const PublishForm: React.FC<StatementResultFormProps<Publish>> = ({ statementIndex, statementResult, disabled }) => {
  const dispatch = useUIDispatch();
  const { formatMessage } = useIntl();
  const urls = useHelpUrls('PP_PUBLICATION_CUTTING_ORDERS', 'PP_PUBLICATION_PUBLISH_AUTOMATICALLY');
  const onChange = (value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'publish', statementIndex: statementIndex, attribute: 'automaticallyPublish', value: value });
  };

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <LabelWithHelpTooltip helpUrl={urls[0]} />
      <CheckBoxWithHelpTooltip
        helpUrl={urls[1]}
        disabled={disabled}
        label={formatMessage({ id: 'rule.publish.enable.automatic.publishing' })}
        checked={statementResult.automaticallyPublish ?? false}
        onChange={onChange}
        xlabel="enableAutomaticPublishing"
        tickSize={13}
      />
    </Form>
  );
};

export default PublishRule;
