// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch all files in the monorepo
config.watchFolders = [monorepoRoot];

// 2. Tell Metro where to resolve packages
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Force packages that rely on singleton module state (React contexts,
//    global config) to resolve from the mobile app's node_modules.
//    Without this, pnpm's strict isolation gives each workspace package
//    its own copy, breaking Tamagui's config context and React's shared state.
const singletonPackages = [
  'tamagui',
  '@tamagui/core',
  '@tamagui/web',
  '@tamagui/config',
  '@tamagui/font-inter',
  '@tamagui/animations-css',
  '@tamagui/shorthands',
  '@tamagui/react-native-media-driver',
  'react',
  'react-dom',
  'react-native',
  'react-native-web',
];

const originalResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Check if this is a singleton package (exact match or scoped subpath)
  const isSingleton = singletonPackages.some(
    (pkg) => moduleName === pkg || moduleName.startsWith(pkg + '/')
  );

  if (isSingleton) {
    // Resolve from the mobile app's project root to get a single instance
    const modifiedContext = {
      ...context,
      nodeModulesPaths: [
        path.resolve(projectRoot, 'node_modules'),
        path.resolve(monorepoRoot, 'node_modules'),
      ],
      // Override origin to resolve from the app root
      originModulePath: path.join(projectRoot, 'package.json'),
    };

    if (originalResolveRequest) {
      return originalResolveRequest(modifiedContext, moduleName, platform);
    }
    return context.resolveRequest(modifiedContext, moduleName, platform);
  }

  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
