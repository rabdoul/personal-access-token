import React from 'react';
import { useIntl } from 'react-intl';
import Icon from '@lectra/icon';
import Tooltip from '@lectra/tooltip';

const ErrorIcon: React.FC<{ errorKey: string }> = ({ errorKey }) => {
  const { formatMessage } = useIntl();
  return (
    <Tooltip
      content={
        <>
          <Icon color={'red'} size={15} type="error" /> {formatMessage({ id: errorKey })}
        </>
      }
    >
      <Icon color={'red'} size={15} type="error" />
    </Tooltip>
  );
};

export default ErrorIcon;
