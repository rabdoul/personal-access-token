import React from 'react';
import Input from '@lectra/input';

import { MANDATORY_FIELD_ERROR } from './ErrorIcon';

type InputLengthProps = {
  valueInMeter?: number;
  targetUnit: string;
  disabled: boolean;
  decimalScale: number;
  onValueUpdate: (valueInMeter?: number) => void;
  width: number;
};

const InputLength: React.FC<InputLengthProps> = ({ valueInMeter, targetUnit, disabled, decimalScale, onValueUpdate, width }) => {
  return (
    <>
      <Input
        type="number"
        value={valueInMeter}
        onBlur={evt => onValueUpdate(evt.target.value ? parseFloat(evt.target.value) : undefined)}
        width={width}
        disabled={disabled}
        error={!valueInMeter}
        icon={MANDATORY_FIELD_ERROR}
        numberMaxDigits={decimalScale}
      />
      {targetUnit}
    </>
  );
};

export default InputLength;
