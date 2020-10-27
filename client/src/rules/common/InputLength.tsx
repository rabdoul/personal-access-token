import React from 'react';
import Input from '@lectra/input';

import ErrorIcon from './ErrorIcon';

type InputLengthProps = {
  valueInMeter?: number;
  targetUnit: string;
  disabled: boolean;
  decimalScale: number;
  onValueUpdate: (valueInMeter?: number) => void;
  width: number;
  xlabel: string;
  min?: number;
  errorKey?: string;
};

export const isValueInError = (value?: number | string, min?: number): boolean => value === undefined || value === '' || value < min!!;

const InputLength: React.FC<InputLengthProps> = ({ valueInMeter, targetUnit, disabled, decimalScale, onValueUpdate, width, xlabel, min, errorKey = 'error.field.mandatory' }) => {
  const value = valueInMeter ? convertFromMeter(valueInMeter, targetUnit).toFixed(decimalScale) : valueInMeter;

  return (
    <>
      <Input
        type="number"
        data-xlabel={xlabel}
        value={value}
        onBlur={evt => onValueUpdate(evt.target.value ? convertToMeter(parseFloat(evt.target.value), targetUnit) : undefined)}
        width={width}
        disabled={disabled}
        error={isValueInError(value, min)}
        icon={<ErrorIcon errorKey={errorKey} />}
        numberMaxDigits={decimalScale}
        min={min}
      />
      <div style={{ marginLeft: '5px' }}>{targetUnit}</div>
    </>
  );
};

const METER_TO_CENTIMETER_COEFF = 100;
const METER_TO_INCH_COEFF = 39.37007874;
const METER_TO_YARD_COEFF = 1.0936132983377;

const convertFromMeter = (value: number, unit: string): number => {
  switch (unit) {
    case 'cm':
      return value * METER_TO_CENTIMETER_COEFF;
    case 'yd':
      return value * METER_TO_YARD_COEFF;
    case 'in':
      return value * METER_TO_INCH_COEFF;
    default:
      return value;
  }
};

const convertToMeter = (value: number, unit: string) => {
  switch (unit) {
    case 'cm':
      return value / METER_TO_CENTIMETER_COEFF;
    case 'yd':
      return value / METER_TO_YARD_COEFF;
    case 'in':
      return value / METER_TO_INCH_COEFF;
    default:
      return value;
  }
};

export default InputLength;
