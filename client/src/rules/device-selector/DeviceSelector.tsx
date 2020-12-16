import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import uniqBy from 'lodash/unionBy';
import BasicButton from '@lectra/basicbutton';
import Icon from '@lectra/icon';
import { MANDATORY_FIELD_ERROR } from '../common/ErrorIcon';
import DeviceAttribution from './DeviceAttribution';
import { AssignDevice, CuttingRoom } from '../AssignDeviceRule';
import { DeviceButton, DeviceContainer, DeviceName } from './styles';

type DeviceSelectorProps = { disabled: boolean; statementResult: Partial<AssignDevice>; statementIndex: number; cuttingRoom: CuttingRoom };

const DeviceSelector: React.FC<DeviceSelectorProps> = ({ disabled, statementResult, statementIndex, cuttingRoom }) => {
  const [open, setOpen] = useState(false);
  const { formatMessage } = useIntl();

  const devices = uniqBy(
    cuttingRoom.backlogs.flatMap(backlog => backlog.spreaders.concat(backlog.cutters)),
    'value'
  );

  const spreaderName = devices.find(device => device.value === statementResult.spreaderId)?.label;
  const cutterName = devices.find(device => device.value === statementResult.cutterId)?.label;

  return (
    <div>
      {statementResult.spreaderId || statementResult.cutterId ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <DeviceContainer>
            {spreaderName && (
              <>
                <span>{formatMessage({ id: 'common.allocation.spreader' })}</span>
                <DeviceName>{spreaderName}</DeviceName>
              </>
            )}
            {cutterName && (
              <>
                <span>{formatMessage({ id: 'common.allocation.cutter' })}</span>
                <DeviceName>{cutterName}</DeviceName>
              </>
            )}
          </DeviceContainer>
          <BasicButton
            onClick={() => {
              setOpen(true);
            }}
            disabled={disabled}
            type={'white'}
            xlabel="select-device"
          >
            <Icon type="edit" />
          </BasicButton>
        </div>
      ) : (
        <DeviceButton>
          <BasicButton
            onClick={() => {
              setOpen(true);
            }}
            disabled={disabled}
            type={'white'}
            xlabel="select-device"
          >
            {formatMessage({ id: 'rule.attribution.select.device' })}
          </BasicButton>
          {statementResult.spreaderId === undefined && statementResult.cutterId === undefined && MANDATORY_FIELD_ERROR}
        </DeviceButton>
      )}
      <DeviceAttribution
        statementIndex={statementIndex}
        cutterId={statementResult.cutterId}
        spreaderId={statementResult.spreaderId}
        cuttingRoom={cuttingRoom}
        closeHandler={() => setOpen(false)}
        open={open}
      />
    </div>
  );
};

export default DeviceSelector;
