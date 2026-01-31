import { describe, it, expect } from 'vitest';
import {
  loginSchema,
  registrationSchema,
  contactSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  requiredString,
} from '../schemas';

describe('Validation Schemas', () => {
  describe('emailSchema', () => {
    it('should validate correct emails', () => {
      const result = emailSchema.safeParse('test@example.com');
      expect(result.success).toBe(true);
    });

    it('should reject invalid emails', () => {
      const result = emailSchema.safeParse('invalid-email');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Invalid email address');
      }
    });

    it('should reject empty emails', () => {
      const result = emailSchema.safeParse('');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Email is required');
      }
    });
  });

  describe('passwordSchema', () => {
    it('should validate strong passwords', () => {
      const result = passwordSchema.safeParse('MyStr0ngPass');
      expect(result.success).toBe(true);
    });

    it('should reject short passwords', () => {
      const result = passwordSchema.safeParse('Short1');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('8 characters'))).toBe(true);
      }
    });

    it('should require uppercase letters', () => {
      const result = passwordSchema.safeParse('lowercase123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('uppercase'))).toBe(true);
      }
    });

    it('should require lowercase letters', () => {
      const result = passwordSchema.safeParse('UPPERCASE123');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('lowercase'))).toBe(true);
      }
    });

    it('should require numbers', () => {
      const result = passwordSchema.safeParse('NoNumbersHere');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('number'))).toBe(true);
      }
    });
  });

  describe('phoneSchema', () => {
    it('should validate international phone numbers', () => {
      expect(phoneSchema.safeParse('+491234567890').success).toBe(true);
      expect(phoneSchema.safeParse('+1234567890123').success).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(phoneSchema.safeParse('not-a-phone').success).toBe(false);
      expect(phoneSchema.safeParse('123').success).toBe(false);
    });
  });

  describe('requiredString', () => {
    it('should create a schema that requires non-empty strings', () => {
      const nameSchema = requiredString('Name');

      expect(nameSchema.safeParse('John').success).toBe(true);

      const emptyResult = nameSchema.safeParse('');
      expect(emptyResult.success).toBe(false);
      if (!emptyResult.success) {
        expect(emptyResult.error.issues[0].message).toBe('Name is required');
      }
    });
  });

  describe('loginSchema', () => {
    it('should validate correct login data', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
        rememberMe: true,
      });
      expect(result.success).toBe(true);
    });

    it('should allow optional rememberMe', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('should reject missing email', () => {
      const result = loginSchema.safeParse({
        password: 'password123',
      });
      expect(result.success).toBe(false);
    });

    it('should reject missing password', () => {
      const result = loginSchema.safeParse({
        email: 'user@example.com',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registrationSchema', () => {
    it('should validate correct registration data', () => {
      const result = registrationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'MyStr0ngPass',
        confirmPassword: 'MyStr0ngPass',
        acceptTerms: true,
      });
      expect(result.success).toBe(true);
    });

    it('should reject when passwords do not match', () => {
      const result = registrationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'MyStr0ngPass',
        confirmPassword: 'DifferentPass1',
        acceptTerms: true,
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('match'))).toBe(true);
      }
    });

    it('should reject when terms are not accepted', () => {
      const result = registrationSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'MyStr0ngPass',
        confirmPassword: 'MyStr0ngPass',
        acceptTerms: false,
      });
      expect(result.success).toBe(false);
    });
  });

  describe('contactSchema', () => {
    it('should validate correct contact data', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+491234567890',
        subject: 'Inquiry',
        message: 'This is a test message for the contact form.',
      });
      expect(result.success).toBe(true);
    });

    it('should allow empty phone', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        phone: '',
        subject: 'Inquiry',
        message: 'This is a test message.',
      });
      expect(result.success).toBe(true);
    });

    it('should reject short messages', () => {
      const result = contactSchema.safeParse({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Inquiry',
        message: 'Short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.some(i => i.message.includes('10 characters'))).toBe(true);
      }
    });
  });
});
