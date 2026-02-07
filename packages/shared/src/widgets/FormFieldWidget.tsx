import type { FormFieldWidgetDef, WidgetRendererProps } from '@app/types';
import React, { useState, useCallback } from 'react';
import { YStack, Input, TextArea, Paragraph, Label, XStack, Checkbox, Button } from 'tamagui';

export function FormFieldWidget({
  definition,
  screenContext,
}: WidgetRendererProps<FormFieldWidgetDef>) {
  const [value, setValue] = useState('');
  const [checked, setChecked] = useState(false);

  const labelText = definition.label ? screenContext.resolveString(definition.label) : '';
  const placeholderText = definition.placeholder
    ? screenContext.resolveString(definition.placeholder)
    : '';
  const helperText = definition.helperText
    ? screenContext.resolveString(definition.helperText)
    : '';

  const handleSubmit = useCallback(() => {
    if (definition.submitAction) {
      screenContext.executeLink(definition.submitAction);
    }
  }, [definition.submitAction, screenContext.executeLink]);

  return (
    <YStack gap="$1" marginBottom="$2">
      {labelText && (
        <Label htmlFor={definition.name} fontSize="$2" fontWeight="500" color="$gray11">
          {labelText}
          {definition.required && (
            <Paragraph color="$red9" display="inline">
              {' '}
              *
            </Paragraph>
          )}
        </Label>
      )}

      {definition.fieldType === 'textarea' ? (
        <TextArea
          id={definition.name}
          value={value}
          onChangeText={setValue}
          placeholder={placeholderText}
          disabled={definition.disabled}
          minHeight={100}
        />
      ) : definition.fieldType === 'checkbox' ? (
        <XStack alignItems="center" gap="$2">
          <Checkbox
            id={definition.name}
            checked={checked}
            onCheckedChange={(val) => setChecked(!!val)}
            disabled={definition.disabled}
          />
          {labelText && <Label htmlFor={definition.name}>{labelText}</Label>}
        </XStack>
      ) : definition.fieldType === 'select' && definition.options ? (
        <YStack gap="$1">
          {definition.options.map((opt) => {
            const optLabel =
              typeof opt.label === 'string' ? opt.label : opt.label.defaultValue || opt.label.key;
            return (
              <Button
                key={opt.value}
                variant={value === opt.value ? undefined : undefined}
                backgroundColor={value === opt.value ? '$blue4' : '$gray2'}
                onPress={() => setValue(opt.value)}
                size="$3"
              >
                {optLabel}
              </Button>
            );
          })}
        </YStack>
      ) : (
        <Input
          id={definition.name}
          value={value}
          onChangeText={setValue}
          placeholder={placeholderText}
          disabled={definition.disabled}
          secureTextEntry={definition.fieldType === 'password'}
          keyboardType={
            definition.fieldType === 'email'
              ? 'email-address'
              : definition.fieldType === 'number'
                ? 'numeric'
                : definition.fieldType === 'tel'
                  ? 'phone-pad'
                  : 'default'
          }
        />
      )}

      {helperText && (
        <Paragraph fontSize="$1" color="$gray9">
          {helperText}
        </Paragraph>
      )}
    </YStack>
  );
}
