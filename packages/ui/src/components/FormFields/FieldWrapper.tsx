import { YStack, XStack, Text, Label as TamaguiLabel, styled } from 'tamagui';
import { AlertCircle } from '@tamagui/lucide-icons';
import type { ReactNode } from 'react';

export const FieldContainer = styled(YStack, {
  gap: '$1',
  width: '100%',
});

export const ErrorText = styled(Text, {
  color: '$red10',
  fontSize: '$1',
});

export const HelperText = styled(Text, {
  color: '$gray10',
  fontSize: '$1',
});

export const RequiredMark = styled(Text, {
  color: '$red10',
  marginLeft: '$1',
});

export interface FieldWrapperProps {
  name: string;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  children: ReactNode;
  hideLabel?: boolean;
}

export function FieldWrapper({
  name,
  label,
  error,
  helperText,
  required,
  children,
  hideLabel = false,
}: FieldWrapperProps) {
  return (
    <FieldContainer>
      {label && !hideLabel && (
        <TamaguiLabel htmlFor={name} fontSize="$3" fontWeight="500">
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </TamaguiLabel>
      )}
      {children}
      {error && (
        <XStack alignItems="center" gap="$1">
          <AlertCircle size={12} color="$red10" />
          <ErrorText>{error}</ErrorText>
        </XStack>
      )}
      {helperText && !error && <HelperText>{helperText}</HelperText>}
    </FieldContainer>
  );
}
