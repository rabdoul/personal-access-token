import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';
import Icon from '@lectra/icon';
import { Flags } from '@lectra/ld-react-feature-flags';

import { withHelpTooltip, useHelpUrls } from '../base/Help';
import { Activity } from '../model';
import ActivityIndicator from './ActivityIndicator';

type Props = { activity: Activity; first: boolean; last: boolean; edited: boolean; invalid: boolean };

const FlippedActivityItem: React.FC<Props> = props => {
  return (
    <Flags
      flag="massprod-workflow-enabled"
      fallbackRender={() => {
        return !['generate-section-plan', 'generate-spreading-plan', 'plot', 'assign-device'].includes(props.activity.id) ? <ActivityItem {...props} /> : null;
      }}
    >
      {!['affect-cutting-line'].includes(props.activity.id) ? <ActivityItem {...{ ...props, activity: { ...props.activity, enabled: props.activity.enabled } }} /> : null}
    </Flags>
  );
};

const ActivityItem: React.FC<Props> = ({ activity, first, last, edited, invalid }) => {
  const { formatMessage } = useIntl();
  const currentActivityId = useLocation().pathname.substring(1);
  const selected = currentActivityId === activity.id;
  return (
    <ActivityLink
      to={`${activity.id}`}
      selected={selected}
      disabled={!activity.enabled}
      helpUrl={useHelpUrls(`PP_ACTIVITY_${activity.id}`)[0]}
      data-selected={selected}
      data-edited={edited}
      data-enabled={activity.enabled}
      data-xname={activity.id}
    >
      <ActivityIndicator selected={selected} disabled={!activity.enabled} first={first} last={last} />
      <ActivityName>{formatMessage({ id: `activity.${activity.id}` })}</ActivityName>
      {invalid && <Icon color={'red'} size={15} type="error" />}
      {!invalid && edited && '*'}
    </ActivityLink>
  );
};

const ActivityLink = withHelpTooltip(styled(Link)<{ selected: boolean; disabled: boolean }>`
  align-items: center;
  background-color: ${props => (props.selected ? '#cceaff' : 'white')};
  border-top: 1px solid #ccc;
  color: ${props => (props.disabled ? '#999' : 'black')};
  cursor: pointer;
  display: flex;
  min-height: 48px;
  padding: 0 10px 0 10px;
  text-decoration: none;
  pointer-events: ${props => props.disabled && 'none'};

  &:hover {
    background-color: ${props => (props.selected ? '#cceaff' : '#e6e6e6')};
  }
`);

const ActivityName = styled.span`
  min-width: 260px;
`;

export default FlippedActivityItem;
