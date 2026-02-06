import type {
  RemoteAppConfig,
  ConfigServiceOptions,
  ConfigMeta,
} from '@app/types';

const DEFAULT_CACHE_KEY = 'app_remote_config';
const DEFAULT_CACHE_DURATION = 3600000; // 1 hour
const DEFAULT_RETRY_ATTEMPTS = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second

// Storage interface for cross-platform compatibility
interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

// Safe window access for SSR/RN compatibility
const getWindow = (): (Window & typeof globalThis) | undefined => {
  return typeof window !== 'undefined' ? window : undefined;
};

export class ConfigService {
  private cache: RemoteAppConfig | null = null;
  private endpoint: string;
  private cacheKey: string;
  private cacheDuration: number;
  private retryAttempts: number;
  private retryDelay: number;
  private storage: StorageLike | null = null;

  constructor(options: ConfigServiceOptions) {
    this.endpoint = options.endpoint;
    this.cacheKey = options.cacheKey || DEFAULT_CACHE_KEY;
    this.cacheDuration = options.cacheDuration || DEFAULT_CACHE_DURATION;
    this.retryAttempts = options.retryAttempts || DEFAULT_RETRY_ATTEMPTS;
    this.retryDelay = options.retryDelay || DEFAULT_RETRY_DELAY;

    // Use localStorage if available (web)
    const win = getWindow();
    if (win?.localStorage) {
      this.storage = win.localStorage;
    }

    // Load cached config on init
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    if (!this.storage) return;

    try {
      const cached = this.storage.getItem(this.cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached) as RemoteAppConfig;
        if (!this.isExpired(parsed._meta)) {
          this.cache = parsed;
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  private saveToStorage(config: RemoteAppConfig): void {
    if (!this.storage) return;

    try {
      this.storage.setItem(this.cacheKey, JSON.stringify(config));
    } catch {
      // Ignore storage errors (quota exceeded, etc.)
    }
  }

  private isExpired(meta: ConfigMeta): boolean {
    return Date.now() > meta.expiresAt;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private addMeta(config: Omit<RemoteAppConfig, '_meta'>): RemoteAppConfig {
    const now = Date.now();
    return {
      ...config,
      _meta: {
        version: (config as RemoteAppConfig)._meta?.version || 'unknown',
        fetchedAt: now,
        expiresAt: now + this.cacheDuration,
      },
    } as RemoteAppConfig;
  }

  async fetchConfig(): Promise<RemoteAppConfig> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
      try {
        const response = await fetch(this.endpoint, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Config fetch failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const config = this.addMeta(data);

        // Update cache
        this.cache = config;
        this.saveToStorage(config);

        return config;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Wait before retrying (except on last attempt)
        if (attempt < this.retryAttempts - 1) {
          await this.delay(this.retryDelay * (attempt + 1));
        }
      }
    }

    throw lastError || new Error('Config fetch failed after retries');
  }

  async refreshConfig(): Promise<RemoteAppConfig> {
    return this.fetchConfig();
  }

  getCachedConfig(): RemoteAppConfig | null {
    return this.cache;
  }

  isConfigStale(): boolean {
    if (!this.cache) return true;
    return this.isExpired(this.cache._meta);
  }

  clearCache(): void {
    this.cache = null;
    if (this.storage) {
      this.storage.removeItem(this.cacheKey);
    }
  }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }
}

// Singleton instance
let configServiceInstance: ConfigService | null = null;

export function getConfigService(options?: ConfigServiceOptions): ConfigService {
  if (!configServiceInstance && options) {
    configServiceInstance = new ConfigService(options);
  }
  if (!configServiceInstance) {
    throw new Error('ConfigService not initialized. Call with options first.');
  }
  return configServiceInstance;
}

export function resetConfigService(): void {
  configServiceInstance = null;
}
