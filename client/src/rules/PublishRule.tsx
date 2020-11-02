import React from 'react';
import { useIntl } from 'react-intl';

import { CheckBoxWithHelpTooltip, useHelpUrls } from '../base/Help';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form } from './common/styles';

export interface Publish extends StatementResult {
  automaticallyPublish: boolean;
}

const PublishRule: React.FC = () => <Rule activityId={'publish'}>{props => <PublishForm {...props} />}</Rule>;

const PublishForm: React.FC<StatementResultFormProps<Publish>> = ({ statementIndex, statementResult, disabled }) => {
  const dispatch = useUIDispatch();
  const { formatMessage } = useIntl();
  const urls = useHelpUrls('PP_PUBLICATION_PUBLISH_AUTOMATICALLY');
  const onChange = (value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'publish', statementIndex: statementIndex, attribute: 'automaticallyPublish', value: value });
  };

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <CheckBoxWithHelpTooltip
        helpUrl={urls[0]}
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
