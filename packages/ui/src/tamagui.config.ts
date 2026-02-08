import { createTamagui, createTokens } from 'tamagui';
import { createInterFont } from '@tamagui/font-inter';
import { shorthands } from '@tamagui/shorthands';
import { themes as baseThemes } from '@tamagui/config/v3';
import { createMedia } from '@tamagui/react-native-media-driver';
import { createAnimations } from '@tamagui/animations-css';

// Modern font configuration
const headingFont = createInterFont({
  size: {
    1: 11,
    2: 12,
    3: 13,
    4: 14,
    5: 16,
    6: 18,
    7: 22,
    8: 28,
    9: 36,
    10: 48,
    11: 56,
    12: 72,
  },
  weight: {
    1: '400',
    2: '400',
    3: '400',
    4: '500',
    5: '500',
    6: '600',
    7: '600',
    8: '700',
    9: '700',
    10: '800',
    11: '800',
    12: '900',
  },
  letterSpacing: {
    5: -0.2,
    6: -0.3,
    7: -0.4,
    8: -0.5,
    9: -0.6,
    10: -0.8,
    11: -1,
    12: -1.2,
  },
});

const bodyFont = createInterFont(
  {
    size: {
      1: 11,
      2: 12,
      3: 13,
      4: 14,
      5: 15,
      6: 16,
      7: 18,
      8: 20,
      // String size tokens used by Button/IconButton variants
      xs: 11,
      sm: 12,
      md: 13,
      lg: 14,
      xl: 15,
    },
    weight: {
      1: '400',
      2: '400',
      3: '400',
      4: '400',
      5: '500',
      6: '500',
      7: '600',
      8: '600',
    },
  },
  {
    sizeLineHeight: (size) => Math.round(size * 1.5),
  }
);

// Modern color palette
const modernColors = {
  // Primary - Vibrant Blue
  primary50: '#eef2ff',
  primary100: '#e0e7ff',
  primary200: '#c7d2fe',
  primary300: '#a5b4fc',
  primary400: '#818cf8',
  primary500: '#6366f1',
  primary600: '#4f46e5',
  primary700: '#4338ca',
  primary800: '#3730a3',
  primary900: '#312e81',

  // Secondary - Purple
  secondary50: '#faf5ff',
  secondary100: '#f3e8ff',
  secondary200: '#e9d5ff',
  secondary300: '#d8b4fe',
  secondary400: '#c084fc',
  secondary500: '#a855f7',
  secondary600: '#9333ea',
  secondary700: '#7c3aed',
  secondary800: '#6b21a8',
  secondary900: '#581c87',

  // Accent - Cyan
  accent50: '#ecfeff',
  accent100: '#cffafe',
  accent200: '#a5f3fc',
  accent300: '#67e8f9',
  accent400: '#22d3ee',
  accent500: '#06b6d4',
  accent600: '#0891b2',
  accent700: '#0e7490',
  accent800: '#155e75',
  accent900: '#164e63',

  // Success - Emerald
  success50: '#ecfdf5',
  success100: '#d1fae5',
  success200: '#a7f3d0',
  success300: '#6ee7b7',
  success400: '#34d399',
  success500: '#10b981',
  success600: '#059669',
  success700: '#047857',
  success800: '#065f46',
  success900: '#064e3b',

  // Warning - Amber
  warning50: '#fffbeb',
  warning100: '#fef3c7',
  warning200: '#fde68a',
  warning300: '#fcd34d',
  warning400: '#fbbf24',
  warning500: '#f59e0b',
  warning600: '#d97706',
  warning700: '#b45309',
  warning800: '#92400e',
  warning900: '#78350f',

  // Error - Rose
  error50: '#fff1f2',
  error100: '#ffe4e6',
  error200: '#fecdd3',
  error300: '#fda4af',
  error400: '#fb7185',
  error500: '#f43f5e',
  error600: '#e11d48',
  error700: '#be123c',
  error800: '#9f1239',
  error900: '#881337',

  // Neutral - Slate (more modern than gray)
  neutral50: '#f8fafc',
  neutral100: '#f1f5f9',
  neutral200: '#e2e8f0',
  neutral300: '#cbd5e1',
  neutral400: '#94a3b8',
  neutral500: '#64748b',
  neutral600: '#475569',
  neutral700: '#334155',
  neutral800: '#1e293b',
  neutral900: '#0f172a',
  neutral950: '#020617',
};

// Custom tokens
const tokens = createTokens({
  size: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    11: 44,
    12: 48,
    14: 56,
    16: 64,
    20: 80,
    24: 96,
    true: 16,
  },
  space: {
    0: 0,
    0.5: 2,
    1: 4,
    1.5: 6,
    2: 8,
    2.5: 10,
    3: 12,
    3.5: 14,
    4: 16,
    5: 20,
    6: 24,
    7: 28,
    8: 32,
    9: 36,
    10: 40,
    12: 48,
    16: 64,
    20: 80,
    true: 16,
    '-0.5': -2,
    '-1': -4,
    '-2': -8,
    '-3': -12,
    '-4': -16,
  },
  radius: {
    0: 0,
    1: 4,
    2: 6,
    3: 8,
    4: 12,
    5: 16,
    6: 20,
    7: 24,
    8: 32,
    9: 40,
    10: 48,
    full: 9999,
    true: 12,
  },
  zIndex: {
    0: 0,
    1: 100,
    2: 200,
    3: 300,
    4: 400,
    5: 500,
    modal: 1000,
    toast: 1100,
    tooltip: 1200,
  },
  color: {
    ...modernColors,
    // Semantic aliases
    background: modernColors.neutral50,
    backgroundHover: modernColors.neutral100,
    backgroundPress: modernColors.neutral200,
    backgroundFocus: modernColors.neutral100,
    backgroundStrong: modernColors.neutral200,
    backgroundTransparent: 'rgba(248, 250, 252, 0)',

    color: modernColors.neutral900,
    colorHover: modernColors.neutral800,
    colorPress: modernColors.neutral700,
    colorFocus: modernColors.neutral800,
    colorTransparent: 'rgba(15, 23, 42, 0)',

    borderColor: modernColors.neutral200,
    borderColorHover: modernColors.neutral300,
    borderColorPress: modernColors.neutral400,
    borderColorFocus: modernColors.primary500,

    placeholderColor: modernColors.neutral400,

    // Glass effect colors
    glassBackground: 'rgba(255, 255, 255, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.3)',
    glassBackgroundDark: 'rgba(15, 23, 42, 0.7)',
    glassBorderDark: 'rgba(255, 255, 255, 0.1)',

    // Gradient tokens
    gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    gradientSecondary: 'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
    gradientSuccess: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',

    // Shadow colors
    shadowColorLight: 'rgba(15, 23, 42, 0.08)',
    shadowColorMedium: 'rgba(15, 23, 42, 0.12)',
    shadowColorStrong: 'rgba(15, 23, 42, 0.2)',
  },
});

// Modern animations
const animations = createAnimations({
  fast: 'ease-out 150ms',
  medium: 'ease-out 250ms',
  slow: 'ease-out 350ms',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55) 400ms',
  lazy: 'ease-in-out 500ms',
  quick: 'ease-out 100ms',
  tooltip: 'ease-out 200ms',
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275) 300ms',
});

// Modern light theme
const lightTheme = {
  ...baseThemes.light,
  background: tokens.color.neutral50,
  backgroundHover: tokens.color.neutral100,
  backgroundPress: tokens.color.neutral200,
  backgroundFocus: tokens.color.neutral100,
  backgroundStrong: tokens.color.neutral200,
  backgroundTransparent: 'rgba(248, 250, 252, 0)',

  color: tokens.color.neutral900,
  colorHover: tokens.color.neutral800,
  colorPress: tokens.color.neutral700,
  colorFocus: tokens.color.neutral800,
  colorTransparent: 'rgba(15, 23, 42, 0)',

  borderColor: tokens.color.neutral200,
  borderColorHover: tokens.color.neutral300,
  borderColorPress: tokens.color.neutral400,
  borderColorFocus: tokens.color.primary500,

  placeholderColor: tokens.color.neutral400,

  // Primary colors
  primary: tokens.color.primary500,
  primaryHover: tokens.color.primary600,
  primaryPress: tokens.color.primary700,

  // Secondary colors
  secondary: tokens.color.secondary500,
  secondaryHover: tokens.color.secondary600,
  secondaryPress: tokens.color.secondary700,

  // Accent colors
  accent: tokens.color.accent500,
  accentHover: tokens.color.accent600,
  accentPress: tokens.color.accent700,

  // Semantic colors
  success: tokens.color.success500,
  warning: tokens.color.warning500,
  error: tokens.color.error500,

  // Glass
  glassBackground: 'rgba(255, 255, 255, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.4)',

  // Shadows
  shadowColor: 'rgba(15, 23, 42, 0.08)',
  shadowColorStrong: 'rgba(15, 23, 42, 0.16)',
};

// Modern dark theme
const darkTheme = {
  ...baseThemes.dark,
  background: tokens.color.neutral950,
  backgroundHover: tokens.color.neutral900,
  backgroundPress: tokens.color.neutral800,
  backgroundFocus: tokens.color.neutral900,
  backgroundStrong: tokens.color.neutral800,
  backgroundTransparent: 'rgba(2, 6, 23, 0)',

  color: tokens.color.neutral50,
  colorHover: tokens.color.neutral100,
  colorPress: tokens.color.neutral200,
  colorFocus: tokens.color.neutral100,
  colorTransparent: 'rgba(248, 250, 252, 0)',

  borderColor: tokens.color.neutral800,
  borderColorHover: tokens.color.neutral700,
  borderColorPress: tokens.color.neutral600,
  borderColorFocus: tokens.color.primary400,

  placeholderColor: tokens.color.neutral500,

  // Primary colors
  primary: tokens.color.primary400,
  primaryHover: tokens.color.primary300,
  primaryPress: tokens.color.primary500,

  // Secondary colors
  secondary: tokens.color.secondary400,
  secondaryHover: tokens.color.secondary300,
  secondaryPress: tokens.color.secondary500,

  // Accent colors
  accent: tokens.color.accent400,
  accentHover: tokens.color.accent300,
  accentPress: tokens.color.accent500,

  // Semantic colors
  success: tokens.color.success400,
  warning: tokens.color.warning400,
  error: tokens.color.error400,

  // Glass
  glassBackground: 'rgba(15, 23, 42, 0.75)',
  glassBorder: 'rgba(255, 255, 255, 0.1)',

  // Shadows (lighter in dark mode)
  shadowColor: 'rgba(0, 0, 0, 0.3)',
  shadowColorStrong: 'rgba(0, 0, 0, 0.5)',
};

export const config = createTamagui({
  defaultFont: 'body',
  fonts: {
    heading: headingFont,
    body: bodyFont,
  },
  themes: {
    light: lightTheme,
    dark: darkTheme,
    // Sub-themes for different contexts
    light_subtle: {
      ...lightTheme,
      background: tokens.color.neutral100,
    },
    dark_subtle: {
      ...darkTheme,
      background: tokens.color.neutral900,
    },
  },
  tokens,
  shorthands,
  animations,
  media: createMedia({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
});

export default config;

export type AppConfig = typeof config;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}
