import { UnitConfig, unitConfig, UnitType } from 'cutting-room-units';
import { useUnitSystem } from '../../base/UserPreference';

export default function useUnitConfig(unitType: UnitType): UnitConfig {
  const unitSystem = useUnitSystem();
  const config = unitConfig(unitType);
  if (config) {
    return unitSystem === 'metric' ? config.metric : config.imperial;
  }
  throw new Error(`No unit defined for ${unitType}`);
}
