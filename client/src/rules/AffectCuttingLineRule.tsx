import React from 'react';
import { fetchData } from 'raspberry-fetch';
import { useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import DropDownSearch from '@lectra/dropdownsearch';

import { useAccessToken } from '../base/Authentication';
import { StatementResult } from '../model';
import { useUIDispatch } from '../UIState';
import Rule, { StatementResultFormProps } from './common/Rule';
import { Form, SelectWithError } from './common/styles';
import { MANDATORY_FIELD_ERROR } from './common/ErrorIcon';
import DeviceSelector from './device-selector/DeviceSelector';

export interface AffectCuttingLine extends StatementResult {
  assignationType?: number;
  backlogId?: string;
  cutterId?: string;
  spreaderId?: string;
  lineId?: string;
}

export type Item = { label: string; value: string };
export type DeviceItem = { label: string; value: string; groupId: string };
export type BacklogItem = { label: string; value: string; cutters: DeviceItem[]; spreaders: DeviceItem[] };
export type Pair = { from: string; to: string };

export type CuttingRoom = {
  backlogs: BacklogItem[];
  cutterGroups: Item[];
  pairings: Pair[];
  spreaderGroups: Item[];
};

function useCuttingRoom() {
  const token = useAccessToken();
  const { data: cuttingRoom } = useQuery('cutting-room', () => fetchData(token, 'cutting-room'));
  return cuttingRoom;
}

const validateStatementResult = (result: Partial<AffectCuttingLine>) => {
  switch (result.assignationType) {
    case 2:
      return result.spreaderId !== undefined || result.cutterId !== undefined;
    case 1:
      return result.backlogId !== undefined;
    default:
      return true;
  }
};

const AffectCuttingLineRule = () => (
  <Rule activityId={'affect-cutting-line'} validateStatementResult={validateStatementResult}>
    {props => <AffectCuttingLineResultForm {...props} />}
  </Rule>
);

const AffectCuttingLineResultForm: React.FC<StatementResultFormProps<AffectCuttingLine>> = ({ statementResult, statementIndex, disabled }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const cuttingRoom: CuttingRoom = useCuttingRoom();

  const assignationItems = [
    { label: formatMessage({ id: 'rule.attribution.no.assignation' }), value: '0' },
    { label: formatMessage({ id: 'rule.attribution.backlog' }), value: '1' },
    { label: formatMessage({ id: 'rule.attribution.device' }), value: '2' }
  ];

  const updateStatementResult = (attribute: keyof AffectCuttingLine, value: any) => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'affect-cutting-line', statementIndex, attribute, value });
  };

  return (
    <Form onSubmit={e => e.preventDefault()}>
      <SelectWithError
        data-xlabel="assignationType"
        listItems={assignationItems}
        onChange={item => {
          updateStatementResult('assignationType', parseInt(item.value));
          updateStatementResult('backlogId', undefined);
          updateStatementResult('cutterId', undefined);
          updateStatementResult('spreaderId', undefined);
        }}
        disabled={disabled}
        value={statementResult.assignationType === undefined ? undefined : `${statementResult.assignationType}`}
        width={150}
        error={statementResult.assignationType === undefined}
        icon={MANDATORY_FIELD_ERROR}
      />
      {statementResult.assignationType === 1 && (
        <DropDownSearch
          data-xlabel="backlog"
          listItems={cuttingRoom ? cuttingRoom.backlogs : []}
          width={200}
          value={statementResult.backlogId}
          onChange={item => {
            updateStatementResult('backlogId', item ? item.value : undefined);
          }}
          disabled={disabled}
          error={statementResult.assignationType === 1 && !statementResult.backlogId}
          icon={MANDATORY_FIELD_ERROR}
          placeholder={formatMessage({ id: 'common.search' })}
        />
      )}
      {statementResult.assignationType === 2 && <DeviceSelector disabled={disabled} statementResult={statementResult} statementIndex={statementIndex} cuttingRoom={cuttingRoom} />}
    </Form>
  );
};

export default AffectCuttingLineRule;
