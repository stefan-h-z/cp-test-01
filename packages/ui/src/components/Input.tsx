import { Eye, EyeOff, Search, X } from '@tamagui/lucide-icons';
import React, { useState } from 'react';
import {
  styled,
  Input as TamaguiInput,
  TextArea as TamaguiTextArea,
  GetProps,
  YStack,
  XStack,
  Text,
} from 'tamagui';

// Modern Input with smooth animations
export const Input = styled(TamaguiInput, {
  name: 'Input',
  fontFamily: '$body',
  backgroundColor: '$background',
  borderWidth: 1.5,
  borderColor: '$borderColor',
  borderRadius: '$4',
  paddingHorizontal: '$4',
  fontSize: '$4',
  color: '$color',
  placeholderTextColor: '$placeholderColor',
  animation: 'fast',
  cursor: 'text',

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  focusStyle: {
    borderColor: '$primary',
    outlineWidth: 0,
    // Glow effect
    shadowColor: '$primary',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  variants: {
    variant: {
      default: {},
      filled: {
        backgroundColor: '$backgroundStrong',
        borderColor: 'transparent',
        focusStyle: {
          backgroundColor: '$background',
          borderColor: '$primary',
        },
      },
      flushed: {
        borderWidth: 0,
        borderBottomWidth: 2,
        borderRadius: 0,
        paddingHorizontal: 0,
        focusStyle: {
          borderBottomColor: '$primary',
        },
      },
      unstyled: {
        borderWidth: 0,
        backgroundColor: 'transparent',
        paddingHorizontal: 0,
      },
    },
    size: {
      sm: {
        height: 38,
        fontSize: '$3',
        paddingHorizontal: '$3',
        borderRadius: '$3',
      },
      md: {
        height: 46,
        fontSize: '$4',
        paddingHorizontal: '$4',
        borderRadius: '$4',
      },
      lg: {
        height: 54,
        fontSize: '$5',
        paddingHorizontal: '$5',
        borderRadius: '$4',
      },
    },
    error: {
      true: {
        borderColor: '$error',
        focusStyle: {
          borderColor: '$error',
          shadowColor: '$error',
        },
      },
    },
    success: {
      true: {
        borderColor: '$success',
        focusStyle: {
          borderColor: '$success',
          shadowColor: '$success',
        },
      },
    },
  } as const,
  defaultVariants: {
    variant: 'default',
    size: 'md',
  },
});

export type InputProps = GetProps<typeof Input>;

// Modern TextArea
export const TextArea = styled(TamaguiTextArea, {
  name: 'TextArea',
  fontFamily: '$body',
  backgroundColor: '$background',
  borderWidth: 1.5,
  borderColor: '$borderColor',
  borderRadius: '$4',
  padding: '$4',
  fontSize: '$4',
  color: '$color',
  placeholderTextColor: '$placeholderColor',
  minHeight: 120,
  animation: 'fast',

  hoverStyle: {
    borderColor: '$borderColorHover',
  },

  focusStyle: {
    borderColor: '$primary',
    shadowColor: '$primary',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  variants: {
    variant: {
      default: {},
      filled: {
        backgroundColor: '$backgroundStrong',
        borderColor: 'transparent',
      },
    },
    error: {
      true: {
        borderColor: '$error',
      },
    },
  } as const,
});

export type TextAreaProps = GetProps<typeof TextArea>;

// Floating Label Input
const FloatingLabelContainer = styled(YStack, {
  position: 'relative',
  width: '100%',
});

const FloatingLabel = styled(Text, {
  position: 'absolute',
  left: 16,
  backgroundColor: '$background',
  paddingHorizontal: '$1',
  fontSize: '$4',
  color: '$placeholderColor',
  animation: 'fast',
  zIndex: 1,
  pointerEvents: 'none',
  variants: {
    focused: {
      true: {
        top: -8,
        fontSize: '$2',
        color: '$primary',
      },
      false: {
        top: 14,
        fontSize: '$4',
        color: '$placeholderColor',
      },
    },
    hasValue: {
      true: {
        top: -8,
        fontSize: '$2',
      },
    },
    error: {
      true: {
        color: '$error',
      },
    },
  } as const,
});

export interface FloatingInputProps extends InputProps {
  label: string;
  helperText?: string;
  errorMessage?: string;
}

export function FloatingInput({
  label,
  helperText,
  errorMessage,
  value,
  onFocus,
  onBlur,
  error,
  ...props
}: FloatingInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = Boolean(value && String(value).length > 0);

  return (
    <YStack gap="$1" width="100%">
      <FloatingLabelContainer>
        <FloatingLabel focused={isFocused} hasValue={hasValue} error={error}>
          {label}
        </FloatingLabel>
        <Input
          value={value}
          error={error}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </FloatingLabelContainer>
      {(errorMessage || helperText) && (
        <Text fontSize="$2" color={errorMessage ? '$error' : '$placeholderColor'} paddingLeft="$1">
          {errorMessage || helperText}
        </Text>
      )}
    </YStack>
  );
}

// Search Input
const SearchInputContainer = styled(XStack, {
  position: 'relative',
  alignItems: 'center',
  width: '100%',
});

const SearchIconContainer = styled(XStack, {
  position: 'absolute',
  left: 12,
  zIndex: 1,
  pointerEvents: 'none',
});

const ClearButton = styled(XStack, {
  position: 'absolute',
  right: 12,
  width: 20,
  height: 20,
  borderRadius: '$full',
  backgroundColor: '$backgroundStrong',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  animation: 'fast',
  opacity: 0,
  scale: 0.8,
  variants: {
    visible: {
      true: {
        opacity: 1,
        scale: 1,
      },
    },
  } as const,
  hoverStyle: {
    backgroundColor: '$backgroundPress',
  },
});

export interface SearchInputProps extends Omit<InputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
  showClearButton = true,
  ...props
}: SearchInputProps) {
  const handleClear = () => {
    onChangeText('');
    onClear?.();
  };

  return (
    <SearchInputContainer>
      <SearchIconContainer>
        <Search size={18} color="$placeholderColor" />
      </SearchIconContainer>
      <Input
        value={value}
        onChangeText={onChangeText}
        paddingLeft={44}
        paddingRight={showClearButton && value ? 44 : undefined}
        placeholder="Search..."
        {...props}
      />
      {showClearButton && (
        <ClearButton visible={Boolean(value)} onPress={handleClear}>
          <X size={12} color="$color" />
        </ClearButton>
      )}
    </SearchInputContainer>
  );
}

// Password Input with toggle
export interface PasswordInputProps extends InputProps {
  showToggle?: boolean;
}

export function PasswordInput({ showToggle = true, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <XStack position="relative" alignItems="center" width="100%">
      <Input
        secureTextEntry={!showPassword}
        paddingRight={showToggle ? 48 : undefined}
        flex={1}
        {...props}
      />
      {showToggle && (
        <XStack
          position="absolute"
          right={12}
          cursor="pointer"
          onPress={() => setShowPassword(!showPassword)}
          padding="$1"
        >
          {showPassword ? (
            <EyeOff size={20} color="$placeholderColor" />
          ) : (
            <Eye size={20} color="$placeholderColor" />
          )}
        </XStack>
      )}
    </XStack>
  );
}

// Input with addon (prefix/suffix)
export interface InputWithAddonProps extends InputProps {
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export function InputWithAddon({ leftAddon, rightAddon, ...props }: InputWithAddonProps) {
  return (
    <XStack
      borderWidth={1.5}
      borderColor="$borderColor"
      borderRadius="$4"
      overflow="hidden"
      alignItems="center"
      focusWithinStyle={{
        borderColor: '$primary',
      }}
    >
      {leftAddon && (
        <XStack
          paddingHorizontal="$3"
          backgroundColor="$backgroundStrong"
          height="100%"
          alignItems="center"
          borderRightWidth={1}
          borderRightColor="$borderColor"
        >
          {leftAddon}
        </XStack>
      )}
      <Input
        flex={1}
        borderWidth={0}
        borderRadius={0}
        focusStyle={{ shadowOpacity: 0 }}
        {...props}
      />
      {rightAddon && (
        <XStack
          paddingHorizontal="$3"
          backgroundColor="$backgroundStrong"
          height="100%"
          alignItems="center"
          borderLeftWidth={1}
          borderLeftColor="$borderColor"
        >
          {rightAddon}
        </XStack>
      )}
    </XStack>
  );
}
