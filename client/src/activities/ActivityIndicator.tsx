import React from 'react';

interface Props {
  disabled?: boolean;
  first?: boolean;
  last?: boolean;
}

const ActivityIndicator: React.FC<Props> = ({ disabled = false, first = false, last = false }) => {
  return (
    <svg height="48" width="30">
      {!first && <line x1="15" y1="0" x2="15" y2="14" stroke={disabled ? '#999' : '#16a085'} strokeWidth="2" />}
      <circle cx="15" cy="24" r="7" stroke={disabled ? '#999' : '#16a085'} strokeWidth="2" fill="white" />
      {!last && <line x1="15" y1="34" x2="15" y2="48" stroke={disabled ? '#999' : '#16a085'} strokeWidth="2" />}
    </svg>
  );
};

export default ActivityIndicator;
