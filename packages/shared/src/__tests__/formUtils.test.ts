import { describe, it, expect } from 'vitest';
import {
  trimStrings,
  removeEmptyStrings,
  nullifyEmptyStrings,
  isValidEmail,
  isValidUrl,
  isValidPhone,
  checkPasswordStrength,
  getDirtyFields,
  serializeFormState,
  deserializeFormState,
} from '../utils/formUtils';

describe('formUtils', () => {
  describe('trimStrings', () => {
    it('should trim whitespace from string values', () => {
      const data = {
        name: '  John Doe  ',
        email: 'john@example.com  ',
        age: 30,
      };

      const result = trimStrings(data);

      expect(result.name).toBe('John Doe');
      expect(result.email).toBe('john@example.com');
      expect(result.age).toBe(30);
    });

    it('should not modify non-string values', () => {
      const data = {
        count: 42,
        active: true,
        items: ['a', 'b'],
      };

      const result = trimStrings(data);

      expect(result.count).toBe(42);
      expect(result.active).toBe(true);
      expect(result.items).toEqual(['a', 'b']);
    });
  });

  describe('removeEmptyStrings', () => {
    it('should remove empty string values', () => {
      const data = {
        name: 'John',
        email: '',
        phone: undefined,
        city: 'Berlin',
      };

      const result = removeEmptyStrings(data);

      expect(result).toEqual({
        name: 'John',
        city: 'Berlin',
      });
    });
  });

  describe('nullifyEmptyStrings', () => {
    it('should convert empty strings to null', () => {
      const data = {
        name: 'John',
        email: '',
        phone: '',
      };

      const result = nullifyEmptyStrings(data);

      expect(result.name).toBe('John');
      expect(result.email).toBeNull();
      expect(result.phone).toBeNull();
    });
  });

  describe('isValidEmail', () => {
    it('should return true for valid emails', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.org')).toBe(true);
      expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('missing@domain')).toBe(false);
      expect(isValidEmail('@nodomain.com')).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://sub.domain.com/path?query=1')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('example.com')).toBe(false);
    });
  });

  describe('isValidPhone', () => {
    it('should return true for valid phone numbers', () => {
      expect(isValidPhone('+491234567890')).toBe(true);
      expect(isValidPhone('+1234567890')).toBe(true);
      expect(isValidPhone('1234567890')).toBe(true);
    });

    it('should return false for invalid phone numbers', () => {
      expect(isValidPhone('')).toBe(false);
      expect(isValidPhone('abc')).toBe(false);
      expect(isValidPhone('+0123')).toBe(false);
    });
  });

  describe('checkPasswordStrength', () => {
    it('should return weak for short passwords', () => {
      const result = checkPasswordStrength('abc');
      expect(result.label).toBe('weak');
      expect(result.score).toBeLessThanOrEqual(1);
      expect(result.suggestions.length).toBeGreaterThan(0);
    });

    it('should return strong for complex passwords', () => {
      const result = checkPasswordStrength('MyStr0ng!Pass');
      expect(result.score).toBeGreaterThanOrEqual(3);
      expect(['strong', 'very-strong']).toContain(result.label);
    });

    it('should provide suggestions for weak passwords', () => {
      const result = checkPasswordStrength('password');
      expect(result.suggestions).toContain('Add uppercase letters');
      expect(result.suggestions).toContain('Add numbers');
    });
  });

  describe('getDirtyFields', () => {
    it('should return fields that have changed', () => {
      const original = { name: 'John', email: 'john@example.com', age: 30 };
      const current = { name: 'Jane', email: 'john@example.com', age: 31 };

      const dirtyFields = getDirtyFields(original, current);

      expect(dirtyFields).toContain('name');
      expect(dirtyFields).toContain('age');
      expect(dirtyFields).not.toContain('email');
    });

    it('should return empty array when nothing changed', () => {
      const data = { name: 'John', email: 'john@example.com' };

      const dirtyFields = getDirtyFields(data, { ...data });

      expect(dirtyFields).toHaveLength(0);
    });
  });

  describe('serializeFormState / deserializeFormState', () => {
    it('should serialize and deserialize form state', () => {
      const formData = {
        name: 'John',
        email: 'john@example.com',
        age: 30,
      };

      const serialized = serializeFormState(formData);
      const deserialized = deserializeFormState(serialized, { name: '', email: '', age: 0 });

      expect(deserialized).toEqual(formData);
    });

    it('should use default values for invalid JSON', () => {
      const defaults = { name: 'Default', email: '' };
      const deserialized = deserializeFormState('invalid-json', defaults);

      expect(deserialized).toEqual(defaults);
    });
  });
});
