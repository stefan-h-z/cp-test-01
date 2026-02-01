import { Input } from '../Input';
import { FieldWrapper, type FieldWrapperProps } from './FieldWrapper';

type TextFieldType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';

export interface TextFieldProps extends Omit<FieldWrapperProps, 'children'> {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  disabled?: boolean;
  type?: TextFieldType;
}

const typeConfig: Record<TextFieldType, {
  keyboardType?: string;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: string;
  secureTextEntry?: boolean;
  defaultPlaceholder?: string;
}> = {
  text: {},
  email: {
    keyboardType: 'email-address',
    autoCapitalize: 'none',
    autoComplete: 'email',
    defaultPlaceholder: 'Enter email',
  },
  password: {
    autoCapitalize: 'none',
    autoComplete: 'password',
    secureTextEntry: true,
    defaultPlaceholder: 'Enter password',
  },
  number: {
    keyboardType: 'numeric',
  },
  tel: {
    keyboardType: 'phone-pad',
    autoComplete: 'tel',
    defaultPlaceholder: 'Enter phone number',
  },
  url: {
    keyboardType: 'url',
    autoCapitalize: 'none',
    autoComplete: 'url',
    defaultPlaceholder: 'https://example.com',
  },
};

export function TextField({
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
  type = 'text',
}: TextFieldProps) {
  const config = typeConfig[type];

  const handleChange = (text: string) => {
    if (type === 'number') {
      onChange(text);
    } else {
      onChange(text);
    }
  };

  return (
    <FieldWrapper
      name={name}
      label={label}
      error={error}
      helperText={helperText}
      required={required}
    >
      <Input
        id={name}
        placeholder={placeholder || config.defaultPlaceholder}
        value={value}
        onChangeText={handleChange}
        onBlur={onBlur}
        disabled={disabled}
        keyboardType={config.keyboardType as any}
        autoCapitalize={config.autoCapitalize}
        autoComplete={config.autoComplete as any}
        secureTextEntry={config.secureTextEntry}
        borderColor={error ? '$red8' : undefined}
      />
    </FieldWrapper>
  );
}
