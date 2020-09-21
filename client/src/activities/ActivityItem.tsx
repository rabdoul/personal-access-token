import React from 'react';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { Activity } from '../model';
import ActivityIndicator from './ActivityIndicator';

const ActivityItem: React.FC<{ activity: Activity; first: boolean; last: boolean }> = ({ activity, first, last }) => {
  const { formatMessage } = useIntl();
  const i18nKey = `activity.${activity.reference.toLowerCase().split(' ').join('-')}`;
  return (
    <Item selected={false} disabled={!activity.enabled}>
      <ActivityIndicator disabled={!activity.enabled} first={first} last={last} />
      {formatMessage({ id: i18nKey })}
    </Item>
  );
};

export default ActivityItem;

const Item = styled.div<{ selected: boolean; disabled: boolean }>`
  align-items: center;
  background-color: ${props => (props.selected ? '#cceaff' : 'white')};
  border-top: 1px solid #ccc;
  color: ${props => (props.disabled ? '#999' : 'black')};
  cursor: pointer;
  display: flex;
  min-height: 48px;
  padding: 0 10px 0 10px;
  &:hover {
    background-color: ${props => (props.selected ? '#cceaff' : '#e6e6e6')};
  }
`;
