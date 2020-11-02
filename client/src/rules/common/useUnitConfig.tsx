import { UnitConfig, getUnitConfig, UnitType } from 'cutting-room-units';
import { useUnitSystem } from '../../base/UserPreference';

export default function useUnitConfig(unitType: UnitType): UnitConfig {
  const unitSystem = useUnitSystem();
  const config = getUnitConfig(unitType, unitSystem);
  if (config) {
    return config;
  }
  throw new Error(`No unit defined for ${unitType}`);
}
