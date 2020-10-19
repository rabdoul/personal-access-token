import React from 'react';
import useActivityConfiguration from '../activities/useActivityConfiguration';
import CheckBox from '@lectra/checkbox';

import { StatementResult } from '../model';
import { useUIState, useUIDispatch, ActivityId } from '../UIState';
import Rule, { StatementResultFormProps } from './common/Rule';
import { useHelpUrls, withHelpTooltip } from '../base/Help';
import StepDescription from './common/StepDescription';
import useRule from './common/useRule';
import { Form, FormLine } from './common/styles';
import { useIntl } from 'react-intl';
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
  const onChange = (value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'publish', statementIndex: statementIndex, attribute: 'automaticallyPublish', value: value });
  };

  const CheckBoxWithHelp = withHelpTooltip(CheckBox);
  const CheckBoxLabel: React.FC<{}> = () => {
    return <div style={{ margin: '0 20px 0 0px', alignSelf: 'start' }}>{formatMessage({ id: 'rule.publish.publish.cutting.job' })}</div>;
  };
  const CheckBoxLabelWithHelp = withHelpTooltip(CheckBoxLabel);
  return (
    <Form onSubmit={e => e.preventDefault()}>
      <FormLine style={{ paddingTop: '3px' }}>
        <CheckBoxLabelWithHelp helpUrl={useHelpUrls('PP_PUBLICATION_CUTTING_ORDERS')[0]} />
        <CheckBoxWithHelp
          helpUrl={useHelpUrls('PP_PUBLICATION_PUBLISH_AUTOMATICALLY')[0]}
          disabled={disabled}
          label={formatMessage({ id: 'rule.publish.enable.automatic.publishing' })}
          checked={statementResult.automaticallyPublish ?? true}
          onChange={onChange}
          xlabel="enableAutomaticPublishing"
          tickSize={13}
        />
      </FormLine>
    </Form>
  );
};

export default PublishRule;
