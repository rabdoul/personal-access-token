import React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { Link, useLocation } from 'react-router-dom';

import { Activity } from '../model';
import ActivityIndicator from './ActivityIndicator';

interface Props {
  activity: Activity;
  first: boolean;
  last: boolean;
}

const ActivityItem: React.FC<Props> = ({ activity, first, last }) => {
  const { formatMessage } = useIntl();
  const currentActivityId = useLocation().pathname.substring(1);
  const selected = currentActivityId === activity.id;
  return (
    <ActivityLink to={`${activity.id}`} selected={selected} disabled={!activity.enabled} data-selected={selected} data-enabled={activity.enabled} data-xname={activity.id}>
      <ActivityIndicator selected={selected} disabled={!activity.enabled} first={first} last={last} />
      {formatMessage({ id: `activity.${activity.id}`, defaultMessage: activity.reference })}
    </ActivityLink>
  );
};

const ActivityLink = styled(Link)<{ selected: boolean; disabled: boolean }>`
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
`;

export default ActivityItem;
