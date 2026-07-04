/**
 * Multi-environment config for Playwright E2E.
 *
 * Credentials (all envs): playwright@gmail.com / 12345678
 * Staging company allowlist follows qa-docs rule 13-test-case-format.mdc
 */

export type EnvName = 'staging' | 'tyas' | 'merdian';

export interface CompanyConfig {
  id: number;
  code: string;
  /** Label shown in TopBar → Switch Company dropdown */
  label: string;
}

export interface EnvConfig {
  name: EnvName;
  baseURL: string;
  apiURL: string;
  defaultCompany: CompanyConfig;
  allowedCompanies: readonly CompanyConfig[];
}

const STAGING_COMPANIES = [
  { id: 112, code: 'FAT', label: 'FAT' },
  { id: 153, code: 'lumicharmsid', label: 'Lumi Charms.id' },
  { id: 13, code: 'DEV-STG', label: 'Dev Staging' },
  { id: 810, code: 'Lumielle', label: 'Lumielle' },
  { id: 3, code: 'TANRISE', label: 'TANRISE' },
] as const satisfies readonly CompanyConfig[];

export const ENV_CONFIGS: Record<EnvName, EnvConfig> = {
  staging: {
    name: 'staging',
    baseURL: 'https://staging.olshoperp.com',
    apiURL: 'https://api.staging.olshoperp.com/api',
    defaultCompany: STAGING_COMPANIES[0],
    allowedCompanies: STAGING_COMPANIES,
  },
  tyas: {
    name: 'tyas',
    baseURL: 'https://tyas.olshoperp.com',
    apiURL: 'https://api.tyas.olshoperp.com/api',
    defaultCompany: { id: 3, code: 'TANRISE', label: 'TANRISE' },
    allowedCompanies: [
      { id: 3, code: 'TANRISE', label: 'TANRISE' },
      { id: 16, code: 'SOMURAH', label: 'SOMURAH' },
    ],
  },
  merdian: {
    name: 'merdian',
    baseURL: 'https://merdian.olshoperp.com',
    apiURL: 'https://api.merdian.olshoperp.com/api',
    defaultCompany: { id: 4, code: 'WNA', label: 'WNA' },
    allowedCompanies: [{ id: 4, code: 'WNA', label: 'WNA' }],
  },
};

const ENV_NAMES = Object.keys(ENV_CONFIGS) as EnvName[];

export function isEnvName(value: string): value is EnvName {
  return (ENV_NAMES as string[]).includes(value);
}

/** Resolve env from Playwright project name or OLSHOP_ENV override. */
export function getEnvConfig(projectOrEnv?: string): EnvConfig {
  const fromEnv = process.env.OLSHOP_ENV;
  if (fromEnv && isEnvName(fromEnv)) {
    return ENV_CONFIGS[fromEnv];
  }

  if (projectOrEnv && isEnvName(projectOrEnv)) {
    return ENV_CONFIGS[projectOrEnv];
  }

  return ENV_CONFIGS.staging;
}

export function findCompanyByCode(
  env: EnvConfig,
  code: string,
): CompanyConfig | undefined {
  return env.allowedCompanies.find((company) => company.code === code);
}

export function findCompanyById(
  env: EnvConfig,
  id: number,
): CompanyConfig | undefined {
  return env.allowedCompanies.find((company) => company.id === id);
}
