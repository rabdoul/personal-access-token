import React from 'react';
import styled from 'styled-components';
import { Activity } from '../model';

const ActivityItem = (props: { activity: Activity }) => {
  return <Item selected={false}>{props.activity.reference}</Item>;
};

export default ActivityItem;

const Item = styled.div<{ selected: boolean }>`
  align-items: center;
  background-color: ${props => (props.selected ? '#cceaff' : 'white')};
  border-top: 1px solid #ccc;
  cursor: pointer;
  display: flex;
  min-height: 48px;
  padding: 10px;
  &:hover {
    background-color: ${props => (props.selected ? '#cceaff' : '#e6e6e6')};
  }
`;
