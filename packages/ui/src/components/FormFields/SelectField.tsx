import { YStack, XStack, Text } from 'tamagui';
import { FieldWrapper, type FieldWrapperProps } from './FieldWrapper';
import type { SelectOption } from '@app/types';

export interface SelectFieldProps extends Omit<FieldWrapperProps, 'children'> {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
}

export function SelectField({
  name,
  label,
  error,
  helperText,
  required,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: SelectFieldProps) {
  return (
    <FieldWrapper
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
    >
      <YStack gap="$1">
        {options.map((option) => (
          <XStack
            key={option.value}
            alignItems="center"
            gap="$2"
            paddingVertical="$2"
            paddingHorizontal="$3"
            backgroundColor={value === option.value ? '$blue3' : '$gray2'}
            borderRadius="$2"
            borderWidth={1}
            borderColor={
              error ? '$red8' : value === option.value ? '$blue8' : '$gray6'
            }
            opacity={disabled || option.disabled ? 0.5 : 1}
            pressStyle={{ backgroundColor: '$gray3' }}
            onPress={() => {
              if (!disabled && !option.disabled) {
                onChange(option.value);
              }
            }}
            cursor={disabled || option.disabled ? 'not-allowed' : 'pointer'}
          >
            <Text fontSize="$3" color={value === option.value ? '$blue11' : '$gray11'}>
              {option.label}
            </Text>
          </XStack>
        ))}
        {options.length === 0 && (
          <Text fontSize="$2" color="$gray9">
            {placeholder || 'No options available'}
          </Text>
        )}
      </YStack>
    </FieldWrapper>
  );
}
