import React from 'react';
import { useIntl } from 'react-intl';
import Icon from '@lectra/icon';
import Tooltip from '@lectra/tooltip';

const ErrorIcon: React.FC<{ errorKey: string | undefined }> = ({ errorKey }) => {
  const { formatMessage } = useIntl();
  return (
    <Tooltip
      content={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Icon color={'red'} size={20} type="error" />
          {errorKey && <div style={{ marginLeft: '10px' }}>{formatMessage({ id: errorKey })}</div>}
        </div>
      }
    >
      <Icon color={'red'} size={15} type="error" />
    </Tooltip>
  );
};

export const MANDATORY_FIELD_ERROR = <ErrorIcon errorKey="error.field.mandatory" />;

export default ErrorIcon;
