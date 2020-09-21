import React from 'react';

const ActivityIndicator: React.FC<{ disabled?: boolean; first?: boolean; last?: boolean }> = ({ disabled = false, first = false, last = false }) => {
  const y1 = first ? '24' : '0';
  const y2 = last ? '24' : '48';
  return (
    <svg height="48" width="30">
      <line x1="15" y1={y1} x2="15" y2={y2} stroke={disabled ? '#999' : '#16a085'} strokeWidth="2" />
      <circle cx="15" cy="24" r="9" stroke="white" strokeWidth="2" fill="white" />
      <circle cx="15" cy="24" r="7" stroke={disabled ? '#999' : '#16a085'} strokeWidth="2" fill="white" />
    </svg>
  );
};

export default ActivityIndicator;
