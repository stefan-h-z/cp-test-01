/**
 * Environment types
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Environment-specific configuration
 */
export interface EnvironmentConfig {
  /** Environment name */
  name: Environment;
  /** API base URL */
  apiBaseUrl: string;
  /** API timeout in milliseconds */
  apiTimeout: number;
  /** Enable debug mode */
  debug: boolean;
  /** Enable analytics */
  analytics: boolean;
  /** Enable error reporting */
  errorReporting: boolean;
  /** Sentry DSN (if error reporting enabled) */
  sentryDsn?: string;
  /** Analytics key (if analytics enabled) */
  analyticsKey?: string;
  /** Log level */
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  /** Enable mock data */
  useMockData: boolean;
  /** Feature flags */
  featureFlags: {
    /** Enable experimental features */
    experimental: boolean;
    /** Enable beta features */
    beta: boolean;
  };
}

/**
 * Development environment configuration
 */
export const developmentConfig: EnvironmentConfig = {
  name: 'development',
  apiBaseUrl: 'http://localhost:3000/api',
  apiTimeout: 30000,
  debug: true,
  analytics: false,
  errorReporting: false,
  logLevel: 'debug',
  useMockData: true,
  featureFlags: {
    experimental: true,
    beta: true,
  },
};

/**
 * Staging environment configuration
 */
export const stagingConfig: EnvironmentConfig = {
  name: 'staging',
  apiBaseUrl: 'https://staging-api.example.com/api',
  apiTimeout: 15000,
  debug: true,
  analytics: true,
  errorReporting: true,
  sentryDsn: process.env.SENTRY_DSN,
  analyticsKey: process.env.ANALYTICS_KEY,
  logLevel: 'info',
  useMockData: false,
  featureFlags: {
    experimental: true,
    beta: true,
  },
};

/**
 * Production environment configuration
 */
export const productionConfig: EnvironmentConfig = {
  name: 'production',
  apiBaseUrl: 'https://api.example.com/api',
  apiTimeout: 10000,
  debug: false,
  analytics: true,
  errorReporting: true,
  sentryDsn: process.env.SENTRY_DSN,
  analyticsKey: process.env.ANALYTICS_KEY,
  logLevel: 'error',
  useMockData: false,
  featureFlags: {
    experimental: false,
    beta: false,
  },
};

/**
 * All environment configurations
 */
const environments: Record<Environment, EnvironmentConfig> = {
  development: developmentConfig,
  staging: stagingConfig,
  production: productionConfig,
};

/**
 * Detect current environment from environment variables
 */
function detectEnvironment(): Environment {
  // Check for explicit APP_ENV or NODE_ENV
  const envVar = process.env.APP_ENV || process.env.NODE_ENV;

  if (envVar === 'production' || envVar === 'prod') {
    return 'production';
  }
  if (envVar === 'staging' || envVar === 'stage') {
    return 'staging';
  }

  return 'development';
}

/**
 * Current environment
 */
export const currentEnvironment: Environment = detectEnvironment();

/**
 * Get environment configuration for specified or current environment
 */
export function getEnvironmentConfig(env?: Environment): EnvironmentConfig {
  const targetEnv = env || currentEnvironment;
  return environments[targetEnv];
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return currentEnvironment === 'development';
}

/**
 * Check if running in staging
 */
export function isStaging(): boolean {
  return currentEnvironment === 'staging';
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return currentEnvironment === 'production';
}

/**
 * Check if debug mode is enabled
 */
export function isDebugEnabled(): boolean {
  return getEnvironmentConfig().debug;
}

/**
 * Get current log level
 */
export function getLogLevel(): EnvironmentConfig['logLevel'] {
  return getEnvironmentConfig().logLevel;
}
