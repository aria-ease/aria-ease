export type StrictnessMode = 'minimal' | 'balanced' | 'strict' | 'paranoid';
export type ContractLevel = 'required' | 'recommended' | 'optional';
export type Enforcement = 'error' | 'warning' | 'ignore';

const FALLBACK_LEVEL: ContractLevel = 'required';

export function normalizeLevel(level?: string): ContractLevel {
  if (level === 'required' || level === 'recommended' || level === 'optional') {
    return level;
  }
  return FALLBACK_LEVEL;
}

export function normalizeStrictness(strictness?: string): StrictnessMode {
  if (strictness === 'minimal' || strictness === 'balanced' || strictness === 'strict' || strictness === 'paranoid') {
    return strictness;
  }
  return 'balanced';
}

export function resolveEnforcement(level: ContractLevel, strictness: StrictnessMode): Enforcement {
  const matrix: Record<StrictnessMode, Record<ContractLevel, Enforcement>> = {
    minimal: {
      required: 'error',
      recommended: 'ignore',
      optional: 'ignore'
    },
    balanced: {
      required: 'error',
      recommended: 'warning',
      optional: 'ignore'
    },
    strict: {
      required: 'error',
      recommended: 'error',
      optional: 'warning'
    },
    paranoid: {
      required: 'error',
      recommended: 'error',
      optional: 'error'
    }
  };

  return matrix[strictness][level];
}
