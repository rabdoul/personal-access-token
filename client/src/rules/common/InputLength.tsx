import React from 'react';
import Input from '@lectra/input';
import { Measure, UnitConfig } from 'cutting-room-units';

import ErrorIcon from './ErrorIcon';

type InputLengthProps = {
  valueInMeter?: number;
  targetUnit: UnitConfig;
  disabled: boolean;
  onValueUpdate: (valueInMeter?: number) => void;
  width: number;
  xlabel: string;
  minInMeter?: number;
  errorKey?: string;
};

export const isValueInError = (value?: number | string, min?: number): boolean => value === undefined || value === '' || value < min!!;

const InputLength: React.FC<InputLengthProps> = ({ valueInMeter, targetUnit, disabled, onValueUpdate, width, xlabel, minInMeter, errorKey = 'error.field.mandatory' }) => {
  const meterConfig: UnitConfig = { unit: 'm', decimalScale: targetUnit.decimalScale };
  const measure: Measure | undefined = valueInMeter !== undefined ? new Measure(valueInMeter, meterConfig).convertTo(targetUnit) : undefined;

  return (
    <>
      <Input
        type="number"
        data-xlabel={xlabel}
        value={measure?.toString()}
        onBlur={evt => onValueUpdate(evt.target.value ? new Measure(parseFloat(evt.target.value), targetUnit).convertTo(meterConfig).value : undefined)}
        width={width}
        disabled={disabled}
        error={isValueInError(valueInMeter, minInMeter)}
        icon={<ErrorIcon errorKey={errorKey} />}
        numberMaxDigits={measure?.unitConfig.decimalScale}
        min={minInMeter != undefined ? new Measure(minInMeter, meterConfig).convertTo(targetUnit).value : undefined}
      />
      <div data-xlabel="unit" style={{ marginLeft: '5px' }}>
        {targetUnit.unit}
      </div>
    </>
  );
};

export default InputLength;
