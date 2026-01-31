import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./packages/testing/src/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/apps/mobile/**', // Mobile tests need different setup
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'packages/testing/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
      ],
    },
    testTimeout: 10000,
    hookTimeout: 10000,
  },
  resolve: {
    alias: {
      '@app/types': path.resolve(__dirname, './packages/types/src'),
      '@app/config': path.resolve(__dirname, './packages/config/src'),
      '@app/shared': path.resolve(__dirname, './packages/shared/src'),
      '@app/ui': path.resolve(__dirname, './packages/ui/src'),
      '@app/testing': path.resolve(__dirname, './packages/testing/src'),
    },
  },
});
