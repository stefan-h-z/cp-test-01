import React from 'react';
import { YStack, XStack, Text, Label as TamaguiLabel, Checkbox, styled } from 'tamagui';
import { Check, AlertCircle } from '@tamagui/lucide-icons';
import { Input, TextArea } from './Input';
import type { FormFieldProps, SelectOption } from '@app/types';

const FieldContainer = styled(YStack, {
  gap: '$1',
  width: '100%',
});

const ErrorText = styled(Text, {
  color: '$red10',
  fontSize: '$1',
});

const HelperText = styled(Text, {
  color: '$gray10',
  fontSize: '$1',
});

const RequiredMark = styled(Text, {
  color: '$red10',
  marginLeft: '$1',
});

interface FormFieldComponentProps extends FormFieldProps {
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
}

export function FormField({
  name,
  label,
  placeholder,
  type = 'text',
  disabled = false,
  helperText,
  error,
  required = false,
  options = [],
  value,
  onChange,
  onBlur,
}: FormFieldComponentProps) {
  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <TextArea
            id={name}
            placeholder={placeholder}
            value={String(value || '')}
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            disabled={disabled}
            borderColor={error ? '$red8' : undefined}
          />
        );

      case 'checkbox':
        return (
          <XStack alignItems="center" gap="$2">
            <Checkbox
              id={name}
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(checked)}
              disabled={disabled}
              borderColor={error ? '$red8' : undefined}
            >
              <Checkbox.Indicator>
                <Check size={16} />
              </Checkbox.Indicator>
            </Checkbox>
            {label && (
              <TamaguiLabel htmlFor={name} fontSize="$3">
                {label}
                {required && <RequiredMark>*</RequiredMark>}
              </TamaguiLabel>
            )}
          </XStack>
        );

      case 'select':
        return (
          <SelectField
            name={name}
            options={options}
            value={String(value || '')}
            onChange={(val) => onChange(val)}
            disabled={disabled}
            placeholder={placeholder}
            hasError={Boolean(error)}
          />
        );

      case 'radio':
        return (
          <RadioGroup
            name={name}
            options={options}
            value={String(value || '')}
            onChange={(val) => onChange(val)}
            disabled={disabled}
          />
        );

      case 'email':
        return (
          <Input
            id={name}
            placeholder={placeholder || 'Enter email'}
            value={String(value || '')}
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            disabled={disabled}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            borderColor={error ? '$red8' : undefined}
          />
        );

      case 'password':
        return (
          <Input
            id={name}
            placeholder={placeholder || 'Enter password'}
            value={String(value || '')}
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            disabled={disabled}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            borderColor={error ? '$red8' : undefined}
          />
        );

      case 'number':
        return (
          <Input
            id={name}
            placeholder={placeholder}
            value={String(value || '')}
            onChangeText={(text) => {
              const numValue = text === '' ? '' : Number(text);
              onChange(numValue);
            }}
            onBlur={onBlur}
            disabled={disabled}
            keyboardType="numeric"
            borderColor={error ? '$red8' : undefined}
          />
        );

      case 'tel':
        return (
          <Input
            id={name}
            placeholder={placeholder || 'Enter phone number'}
            value={String(value || '')}
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            disabled={disabled}
            keyboardType="phone-pad"
            autoComplete="tel"
            borderColor={error ? '$red8' : undefined}
          />
        );

      case 'url':
        return (
          <Input
            id={name}
            placeholder={placeholder || 'https://example.com'}
            value={String(value || '')}
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            disabled={disabled}
            keyboardType="url"
            autoCapitalize="none"
            autoComplete="url"
            borderColor={error ? '$red8' : undefined}
          />
        );

      default:
        return (
          <Input
            id={name}
            placeholder={placeholder}
            value={String(value || '')}
            onChangeText={(text) => onChange(text)}
            onBlur={onBlur}
            disabled={disabled}
            borderColor={error ? '$red8' : undefined}
          />
        );
    }
  };

  if (type === 'checkbox') {
    return (
      <FieldContainer>
        {renderInput()}
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

  return (
    <FieldContainer>
      {label && (
        <TamaguiLabel htmlFor={name} fontSize="$3" fontWeight="500">
          {label}
          {required && <RequiredMark>*</RequiredMark>}
        </TamaguiLabel>
      )}
      {renderInput()}
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

// Simple Select Field implementation
interface SelectFieldProps {
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  hasError?: boolean;
}

function SelectField({
  name,
  options,
  value,
  onChange,
  disabled,
  placeholder,
  hasError,
}: SelectFieldProps) {
  return (
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
            hasError ? '$red8' : value === option.value ? '$blue8' : '$gray6'
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
  );
}

// Radio Group implementation
interface RadioGroupProps {
  name: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function RadioGroup({ name, options, value, onChange, disabled }: RadioGroupProps) {
  return (
    <YStack gap="$2">
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
    </YStack>
  );
}

// Form wrapper component
interface FormProps {
  children: React.ReactNode;
  onSubmit?: () => void;
  gap?: string | number;
}

export function Form({ children, onSubmit, gap = '$4' }: FormProps) {
  return (
    <YStack gap={gap} width="100%">
      {children}
    </YStack>
  );
}

// Form Actions (submit button area)
interface FormActionsProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

export function FormActions({ children, align = 'right' }: FormActionsProps) {
  const justifyContent =
    align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end';

  return (
    <XStack justifyContent={justifyContent} gap="$3" marginTop="$2">
      {children}
    </XStack>
  );
}
