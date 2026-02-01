import { TextArea } from '../Input';
import { FieldWrapper, type FieldWrapperProps } from './FieldWrapper';

export interface TextAreaFieldProps extends Omit<FieldWrapperProps, 'children'> {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
}

export function TextAreaField({
  name,
  label,
  error,
  helperText,
  required,
  value,
  onChange,
  onBlur,
  placeholder,
  disabled = false,
}: TextAreaFieldProps) {
  return (
    <FieldWrapper
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
    >
      <TextArea
        id={name}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        onBlur={onBlur}
        disabled={disabled}
        borderColor={error ? '$red8' : undefined}
      />
    </FieldWrapper>
  );
}
