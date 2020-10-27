import { useUnitSystem } from '../../base/UserPreference';
import { UnitConfig } from '../../model';

export default function useUnitConfig(unitType: string): UnitConfig {
  const unitSystem = useUnitSystem();
  if (unitType === 'GroupsProcessing') {
    return unitSystem === 'metric' ? { unit: 'cm', decimalScale: 1 } : { unit: 'in', decimalScale: 2 };
  }
  throw new Error(`No unit defined for ${unitType}`);
}
