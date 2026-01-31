import { z } from 'zod';

// Common validation patterns
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address');

export const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number');

export const urlSchema = z.string().url('Invalid URL');

export const requiredString = (fieldName: string) =>
  z.string().min(1, `${fieldName} is required`);

// Login form schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Registration form schema
export const registrationSchema = z
  .object({
    name: requiredString('Name'),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'You must accept the terms and conditions' }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegistrationFormData = z.infer<typeof registrationSchema>;

// Contact form schema
export const contactSchema = z.object({
  name: requiredString('Name'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  subject: requiredString('Subject'),
  message: z
    .string()
    .min(1, 'Message is required')
    .min(10, 'Message must be at least 10 characters'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Profile form schema
export const profileSchema = z.object({
  name: requiredString('Name'),
  email: emailSchema,
  phone: phoneSchema.optional().or(z.literal('')),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  website: urlSchema.optional().or(z.literal('')),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// Address form schema
export const addressSchema = z.object({
  street: requiredString('Street address'),
  city: requiredString('City'),
  state: requiredString('State'),
  zipCode: z
    .string()
    .min(1, 'ZIP code is required')
    .regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code'),
  country: requiredString('Country'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Generic search schema
export const searchSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  category: z.string().optional(),
  sortBy: z.enum(['relevance', 'date', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type SearchFormData = z.infer<typeof searchSchema>;

// Helper function to create a simple required field schema
export function createRequiredSchema<T extends z.ZodTypeAny>(
  schema: T,
  fieldName: string
): z.ZodEffects<T, z.infer<T>, z.input<T>> {
  return schema.refine(
    (val) => val !== undefined && val !== null && val !== '',
    { message: `${fieldName} is required` }
  );
}

// Re-export zod for convenience
export { z };
