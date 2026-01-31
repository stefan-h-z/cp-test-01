import React, { useState } from 'react';
import { YStack, Text, Spinner } from 'tamagui';
import { FormField, Form, FormActions, Button } from '@app/ui';
import { useAppForm } from '../hooks/useAppForm';
import { loginSchema, type LoginFormData } from '../schemas';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onForgotPassword?: () => void;
  onSignUp?: () => void;
  isLoading?: boolean;
}

export function LoginForm({
  onSubmit,
  onForgotPassword,
  onSignUp,
  isLoading: externalLoading,
}: LoginFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const form = useAppForm<LoginFormData>({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    onSubmit: async (data) => {
      setSubmitError(null);
      try {
        await onSubmit(data);
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : 'Login failed. Please try again.'
        );
      }
    },
  });

  const isLoading = externalLoading || form.isSubmitting;

  return (
    <Form>
      <YStack gap="$4">
        <FormField
          {...form.getFieldProps('email')}
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          disabled={isLoading}
        />

        <FormField
          {...form.getFieldProps('password')}
          label="Password"
          type="password"
          placeholder="Enter your password"
          required
          disabled={isLoading}
        />

        <FormField
          {...form.getFieldProps('rememberMe')}
          label="Remember me"
          type="checkbox"
          disabled={isLoading}
        />

        {submitError && (
          <Text color="$red10" fontSize="$2" textAlign="center">
            {submitError}
          </Text>
        )}

        <FormActions align="center">
          <YStack width="100%" gap="$3">
            <Button
              onPress={form.handleFormSubmit}
              disabled={isLoading}
              width="100%"
            >
              {isLoading ? <Spinner size="small" /> : 'Sign In'}
            </Button>

            {onForgotPassword && (
              <Text
                color="$blue10"
                fontSize="$2"
                textAlign="center"
                onPress={onForgotPassword}
                cursor="pointer"
              >
                Forgot password?
              </Text>
            )}

            {onSignUp && (
              <Text fontSize="$2" textAlign="center" color="$gray11">
                Don't have an account?{' '}
                <Text color="$blue10" onPress={onSignUp} cursor="pointer">
                  Sign up
                </Text>
              </Text>
            )}
          </YStack>
        </FormActions>
      </YStack>
    </Form>
  );
}
