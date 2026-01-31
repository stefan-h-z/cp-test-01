import React, { useState } from 'react';
import { YStack, Text, Spinner } from 'tamagui';
import { FormField, Form, FormActions, Button } from '@app/ui';
import { useAppForm } from '../hooks/useAppForm';
import { contactSchema, type ContactFormData } from '../schemas';

export interface ContactFormProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function ContactForm({
  onSubmit,
  onCancel,
  isLoading: externalLoading,
}: ContactFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useAppForm<ContactFormData>({
    schema: contactSchema,
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: '',
    },
    onSubmit: async (data) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      try {
        await onSubmit(data);
        setSubmitSuccess(true);
        form.reset();
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'Failed to send message. Please try again.'
        );
      }
    },
  });

  const isLoading = externalLoading || form.isSubmitting;

  if (submitSuccess) {
    return (
      <YStack alignItems="center" gap="$4" padding="$4">
        <Text fontSize="$5" fontWeight="600" color="$green10">
          Message Sent!
        </Text>
        <Text fontSize="$3" color="$gray11" textAlign="center">
          Thank you for contacting us. We'll get back to you as soon as possible.
        </Text>
        <Button onPress={() => setSubmitSuccess(false)} variant="outlined">
          Send Another Message
        </Button>
      </YStack>
    );
  }

  return (
    <Form>
      <YStack gap="$4">
        <FormField
          {...form.getFieldProps('name')}
          label="Name"
          type="text"
          placeholder="Enter your name"
          required
          disabled={isLoading}
        />

        <FormField
          {...form.getFieldProps('email')}
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />

        <FormField
          {...form.getFieldProps('phone')}
          label="Phone"
          type="tel"
          placeholder="Enter your phone number (optional)"
          disabled={isLoading}
          helperText="We'll only use this for urgent matters"
        />

        <FormField
          {...form.getFieldProps('subject')}
          label="Subject"
          type="text"
          placeholder="What is this regarding?"
          required
          disabled={isLoading}
        />

        <FormField
          {...form.getFieldProps('message')}
          label="Message"
          type="textarea"
          placeholder="How can we help you?"
          required
          disabled={isLoading}
        />

        {submitError && (
          <Text color="$red10" fontSize="$2" textAlign="center">
            {submitError}
          </Text>
        )}

        <FormActions>
          {onCancel && (
            <Button
              variant="outlined"
              onPress={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button
            onPress={form.handleFormSubmit}
            disabled={isLoading || !form.isDirty}
          >
            {isLoading ? <Spinner size="small" /> : 'Send Message'}
          </Button>
        </FormActions>
      </YStack>
    </Form>
  );
}
