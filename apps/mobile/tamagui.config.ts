// Re-export the config from @app/ui
// This file is needed for the Tamagui babel plugin to find the config
import { config } from '@app/ui';

export { config };
export default config;
