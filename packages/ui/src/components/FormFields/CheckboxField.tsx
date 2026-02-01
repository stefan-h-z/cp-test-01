import { XStack, Label as TamaguiLabel, Checkbox } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import { FieldWrapper, RequiredMark, type FieldWrapperProps } from './FieldWrapper';

export interface CheckboxFieldProps extends Omit<FieldWrapperProps, 'children' | 'hideLabel'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxField({
  name,
  label,
  error,
  helperText,
  required,
  checked,
  onChange,
  disabled = false,
}: CheckboxFieldProps) {
  return (
    <FieldWrapper
      name={name}
      error={error}
      helperText={helperText}
      hideLabel
    >
      <XStack alignItems="center" gap="$2">
        <Checkbox
          id={name}
          checked={checked}
          onCheckedChange={(value) => onChange(Boolean(value))}
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
    </FieldWrapper>
  );
}
