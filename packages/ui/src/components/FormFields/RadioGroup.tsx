import { YStack, XStack, Text } from 'tamagui';
import { FieldWrapper, type FieldWrapperProps } from './FieldWrapper';
import type { SelectOption } from '@app/types';

export interface RadioGroupProps extends Omit<FieldWrapperProps, 'children'> {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  disabled?: boolean;
  direction?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  name,
  label,
  error,
  helperText,
  required,
  value,
  onChange,
  options,
  disabled = false,
  direction = 'vertical',
}: RadioGroupProps) {
  const Container = direction === 'horizontal' ? XStack : YStack;

  return (
    <FieldWrapper
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
    >
      <Container gap="$2" flexWrap={direction === 'horizontal' ? 'wrap' : undefined}>
        {options.map((option) => (
          <XStack
            key={option.value}
            alignItems="center"
            gap="$2"
            opacity={disabled || option.disabled ? 0.5 : 1}
            onPress={() => {
              if (!disabled && !option.disabled) {
                onChange(option.value);
              }
            }}
            cursor={disabled || option.disabled ? 'not-allowed' : 'pointer'}
            paddingVertical="$1"
          >
            <XStack
              width={20}
              height={20}
              borderRadius={10}
              borderWidth={2}
              borderColor={value === option.value ? '$blue9' : '$gray7'}
              alignItems="center"
              justifyContent="center"
            >
              {value === option.value && (
                <XStack
                  width={10}
                  height={10}
                  borderRadius={5}
                  backgroundColor="$blue9"
                />
              )}
            </XStack>
            <Text fontSize="$3">{option.label}</Text>
          </XStack>
        ))}
      </Container>
    </FieldWrapper>
  );
}
