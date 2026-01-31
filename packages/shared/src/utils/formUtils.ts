import { z } from 'zod';

// Form value transformation utilities
export function trimStrings<T extends Record<string, unknown>>(data: T): T {
  const result = { ...data };
  for (const key in result) {
    if (typeof result[key] === 'string') {
      (result as Record<string, unknown>)[key] = (result[key] as string).trim();
    }
  }
  return result;
}

export function removeEmptyStrings<T extends Record<string, unknown>>(data: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key in data) {
    const value = data[key];
    if (value !== '' && value !== undefined && value !== null) {
      result[key] = value;
    }
  }
  return result;
}

export function nullifyEmptyStrings<T extends Record<string, unknown>>(
  data: T
): { [K in keyof T]: T[K] extends string ? T[K] | null : T[K] } {
  const result = { ...data } as { [K in keyof T]: T[K] extends string ? T[K] | null : T[K] };
  for (const key in result) {
    if ((result as Record<string, unknown>)[key] === '') {
      (result as Record<string, unknown>)[key] = null;
    }
  }
  return result;
}

// Error message formatters
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join('.');
    if (!errors[path]) {
      errors[path] = issue.message;
    }
  }
  return errors;
}

export function getFirstError(errors: Record<string, string>): string | undefined {
  const keys = Object.keys(errors);
  return keys.length > 0 ? errors[keys[0]] : undefined;
}

// Form field helpers
export function createFieldName<T extends string>(base: T, index?: number): string {
  return index !== undefined ? `${base}.${index}` : base;
}

export function parseFieldName(name: string): { base: string; index?: number } {
  const parts = name.split('.');
  if (parts.length === 2) {
    const index = parseInt(parts[1], 10);
    if (!isNaN(index)) {
      return { base: parts[0], index };
    }
  }
  return { base: name };
}

// Dirty fields checker
export function getDirtyFields<T extends Record<string, unknown>>(
  original: T,
  current: T
): (keyof T)[] {
  const dirtyFields: (keyof T)[] = [];
  for (const key in current) {
    if (JSON.stringify(original[key]) !== JSON.stringify(current[key])) {
      dirtyFields.push(key);
    }
  }
  return dirtyFields;
}

// Form state serialization (for persistence)
export function serializeFormState<T extends Record<string, unknown>>(data: T): string {
  return JSON.stringify(data);
}

export function deserializeFormState<T extends Record<string, unknown>>(
  serialized: string,
  defaultValues: T
): T {
  try {
    const parsed = JSON.parse(serialized);
    return { ...defaultValues, ...parsed };
  } catch {
    return defaultValues;
  }
}

// Validation helpers
export function validateField<T>(
  schema: z.ZodSchema<T>,
  value: unknown
): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(value);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error.issues[0]?.message || 'Validation failed' };
}

export function isValidEmail(email: string): boolean {
  return z.string().email().safeParse(email).success;
}

export function isValidUrl(url: string): boolean {
  return z.string().url().safeParse(url).success;
}

export function isValidPhone(phone: string): boolean {
  return /^\+?[1-9]\d{1,14}$/.test(phone);
}

// Password strength checker
export interface PasswordStrength {
  score: number; // 0-4
  label: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  suggestions: string[];
}

export function checkPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  const suggestions: string[] = [];

  if (password.length >= 8) score++;
  else suggestions.push('Use at least 8 characters');

  if (password.length >= 12) score++;

  if (/[A-Z]/.test(password)) score++;
  else suggestions.push('Add uppercase letters');

  if (/[a-z]/.test(password)) score++;
  else suggestions.push('Add lowercase letters');

  if (/[0-9]/.test(password)) score++;
  else suggestions.push('Add numbers');

  if (/[^A-Za-z0-9]/.test(password)) score++;
  else suggestions.push('Add special characters');

  // Normalize score to 0-4
  score = Math.min(4, Math.floor(score * 0.67));

  const labels: PasswordStrength['label'][] = ['weak', 'fair', 'good', 'strong', 'very-strong'];

  return {
    score,
    label: labels[score],
    suggestions,
  };
}

// Form data conversion utilities
export function formDataToObject<T extends Record<string, unknown>>(formData: FormData): T {
  const result: Record<string, unknown> = {};
  formData.forEach((value, key) => {
    if (result[key] !== undefined) {
      if (Array.isArray(result[key])) {
        (result[key] as unknown[]).push(value);
      } else {
        result[key] = [result[key], value];
      }
    } else {
      result[key] = value;
    }
  });
  return result as T;
}

export function objectToFormData<T extends Record<string, unknown>>(obj: T): FormData {
  const formData = new FormData();
  for (const key in obj) {
    const value = obj[key];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => formData.append(key, String(item)));
      } else {
        formData.append(key, String(value));
      }
    }
  }
  return formData;
}
