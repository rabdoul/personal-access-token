import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import BasicButton from '@lectra/basicbutton';
import Popup from '@lectra/popup';

import { ApplyButton, Content, PopupStyled } from './styles';
import { CuttingRoom } from '../AffectCuttingLineRule';
import { useUIDispatch } from '../../UIState';
import DeviceAttributionFilters from './DeviceAttributionFilters';
import DeviceAttributionLists from './DeviceAttributionLists';

export type AttributionState = {
  selectedCutter: string | undefined;
  selectedSpreader: string | undefined;
};

export type PopupFilters = {
  filterBacklog: string;
  filterCutterGroup: string;
  filterSpreaderGroup: string;
};

type DeviceAttributionProps = { statementIndex: number; spreaderId?: string; cutterId?: string; cuttingRoom: CuttingRoom; closeHandler: () => void; open: boolean };

const initialPopupFilters = {
  filterBacklog: 'all',
  filterCutterGroup: 'all',
  filterSpreaderGroup: 'all'
};

const DeviceAttribution: React.FC<DeviceAttributionProps> = ({ statementIndex, spreaderId, cutterId, cuttingRoom, closeHandler, open }) => {
  const { formatMessage } = useIntl();
  const dispatch = useUIDispatch();

  const initialAttributionState: AttributionState = {
    selectedCutter: cutterId,
    selectedSpreader: spreaderId
  };

  const [attributionState, setAttributionState] = useState<AttributionState>(initialAttributionState);
  const [filters, setFilters] = useState<PopupFilters>(initialPopupFilters);

  const isApplyEnabled = attributionState.selectedCutter || attributionState.selectedSpreader;

  const applyHandler = () => {
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'affect-cutting-line', statementIndex, attribute: 'spreaderId', value: attributionState.selectedSpreader });
    dispatch({ type: 'UPDATE_STATEMENT_RESULT', activityId: 'affect-cutting-line', statementIndex, attribute: 'cutterId', value: attributionState.selectedCutter });
    closeHandler();
  };

  return (
    <PopupStyled open={open} onClose={closeHandler} maxWidth="md">
      <Popup.Header>{formatMessage({ id: 'rule.attribution.popin.allocate.device.title' })}</Popup.Header>
      <Content>
        <DeviceAttributionFilters filters={filters} setFilters={setFilters} cuttingRoom={cuttingRoom} />
        <DeviceAttributionLists attributionState={attributionState} setAttributionState={setAttributionState} filters={filters} cuttingRoom={cuttingRoom} />
      </Content>
      <Popup.Footer>
        <ApplyButton minWidth={100} type="blue" onClick={applyHandler} xlabel="apply" disabled={!isApplyEnabled}>
          {formatMessage({ id: 'command.apply' })}
        </ApplyButton>
        <BasicButton minWidth={100} type="black" onClick={closeHandler} xlabel="cancel">
          {formatMessage({ id: 'command.cancel' })}
        </BasicButton>
      </Popup.Footer>
    </PopupStyled>
  );
};

export default DeviceAttribution;
