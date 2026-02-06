import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import {
  useForm,
  UseFormReturn,
  FieldValues,
  DefaultValues,
  Path,
  PathValue,
  UseFormProps,
} from 'react-hook-form';
import { z } from 'zod';

export interface UseAppFormOptions<T extends FieldValues> extends Omit<
  UseFormProps<T>,
  'resolver'
> {
  schema: z.ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
  onSubmit?: (data: T) => void | Promise<void>;
  onError?: (errors: Record<string, string>) => void;
}

export interface UseAppFormReturn<T extends FieldValues> extends UseFormReturn<T> {
  // Field helpers
  getFieldProps: (name: Path<T>) => {
    name: Path<T>;
    value: PathValue<T, Path<T>>;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    error?: string;
  };
  // Submit handler
  handleFormSubmit: () => Promise<void>;
  // Form state helpers
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  // Error helpers
  getError: (name: Path<T>) => string | undefined;
  hasError: (name: Path<T>) => boolean;
  // Reset helpers
  resetField: (name: Path<T>) => void;
  // Value helpers
  setFieldValue: (name: Path<T>, value: PathValue<T, Path<T>>) => void;
}

export function useAppForm<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  ...formOptions
}: UseAppFormOptions<T>): UseAppFormReturn<T> {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
    ...formOptions,
  });

  const {
    formState: { isSubmitting, isValid, isDirty },
    handleSubmit,
    setValue,
    getValues,
    trigger,
    clearErrors,
    getFieldState,
  } = form;

  // Get field props for easy integration with FormField component
  const getFieldProps = useCallback(
    (name: Path<T>) => {
      const value = getValues(name);
      const fieldState = getFieldState(name, form.formState);

      return {
        name,
        value,
        onChange: (newValue: unknown) => {
          setValue(name, newValue as PathValue<T, Path<T>>, {
            shouldValidate: fieldState.isTouched,
            shouldDirty: true,
          });
        },
        onBlur: () => {
          trigger(name);
        },
        error: fieldState.error?.message,
      };
    },
    [getValues, getFieldState, form.formState, setValue, trigger]
  );

  // Get error message for a field
  const getError = useCallback(
    (name: Path<T>): string | undefined => {
      const fieldState = getFieldState(name, form.formState);
      return fieldState.error?.message;
    },
    [getFieldState, form.formState]
  );

  // Check if field has error
  const hasError = useCallback(
    (name: Path<T>): boolean => {
      return Boolean(getError(name));
    },
    [getError]
  );

  // Reset a single field
  const resetFieldFn = useCallback(
    (name: Path<T>) => {
      const defaultValue = defaultValues?.[name as keyof typeof defaultValues];
      setValue(name, defaultValue as PathValue<T, Path<T>>);
      clearErrors(name);
    },
    [setValue, clearErrors, defaultValues]
  );

  // Set field value
  const setFieldValue = useCallback(
    (name: Path<T>, value: PathValue<T, Path<T>>) => {
      setValue(name, value, { shouldValidate: true, shouldDirty: true });
    },
    [setValue]
  );

  // Form submit handler
  const handleFormSubmit = useCallback(async () => {
    await handleSubmit(
      async (data) => {
        if (onSubmit) {
          await onSubmit(data);
        }
      },
      (formErrors) => {
        if (onError) {
          const errorMessages: Record<string, string> = {};
          Object.entries(formErrors).forEach(([key, error]) => {
            if (error?.message) {
              errorMessages[key] = error.message;
            }
          });
          onError(errorMessages);
        }
      }
    )();
  }, [handleSubmit, onSubmit, onError]);

  return {
    // Original form return
    ...form,
    // Field helpers
    getFieldProps,
    // Submit handler
    handleFormSubmit,
    // Form state helpers
    isSubmitting,
    isValid,
    isDirty,
    // Error helpers
    getError,
    hasError,
    // Reset helpers
    resetField: resetFieldFn,
    // Value helpers
    setFieldValue,
  };
}

// Hook for handling form submission with API
export interface UseFormSubmitOptions<T, R = unknown> {
  onSuccess?: (data: R) => void;
  onError?: (error: Error) => void;
  transform?: (data: T) => unknown;
}

export function useFormSubmit<T, R = unknown>(
  submitFn: (data: T) => Promise<R>,
  options: UseFormSubmitOptions<T, R> = {}
) {
  const { onSuccess, onError, transform } = options;

  const submit = useCallback(
    async (data: T) => {
      try {
        const transformedData = transform ? transform(data) : data;
        const result = await submitFn(transformedData as T);
        if (onSuccess) {
          onSuccess(result);
        }
        return result;
      } catch (error) {
        if (onError) {
          onError(error instanceof Error ? error : new Error(String(error)));
        }
        throw error;
      }
    },
    [submitFn, onSuccess, onError, transform]
  );

  return { submit };
}
