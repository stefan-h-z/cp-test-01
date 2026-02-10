import type {
  ValidationRule,
  WorkflowFieldConfig,
  WorkflowStepConfig,
  WorkflowConfig,
} from '@app/types';
import { z } from 'zod';

/**
 * Build a Zod schema for a single workflow field based on its type and validation rules.
 */
export function buildFieldSchema(field: WorkflowFieldConfig): z.ZodTypeAny {
  const rules = field.validation ?? [];
  const isRequired = field.required || rules.some((r) => r.type === 'required');
  const requiredMessage = rules.find((r) => r.type === 'required')?.message;

  // Checkbox fields
  if (field.type === 'checkbox') {
    if (isRequired) {
      return z.literal(true, {
        errorMap: () => ({
          message: requiredMessage || 'This field is required',
        }),
      });
    }
    return z.boolean().optional().default(false);
  }

  // Number fields
  if (field.type === 'number') {
    let numberSchema = z.number({
      errorMap: () => ({ message: requiredMessage || 'Must be a valid number' }),
    });

    for (const rule of rules) {
      if (rule.type === 'min' && 'value' in rule) {
        numberSchema = numberSchema.min(rule.value, rule.message);
      } else if (rule.type === 'max' && 'value' in rule) {
        numberSchema = numberSchema.max(rule.value, rule.message);
      }
    }

    if (isRequired) {
      return z.preprocess(
        (val) => (val === '' || val === undefined ? undefined : Number(val)),
        numberSchema
      );
    }

    return z.preprocess(
      (val) => (val === '' || val === undefined || val === null ? undefined : Number(val)),
      numberSchema.optional()
    );
  }

  // String-based fields (text, email, password, tel, url, textarea, select, radio, date)
  let schema: z.ZodTypeAny = z.string();

  if (isRequired) {
    schema = (schema as z.ZodString).min(1, requiredMessage || 'This field is required');
  }

  for (const rule of rules) {
    switch (rule.type) {
      case 'minLength':
        if ('value' in rule) {
          schema = (schema as z.ZodString).min(
            rule.value,
            rule.message || `Must be at least ${rule.value} characters`
          );
        }
        break;
      case 'maxLength':
        if ('value' in rule) {
          schema = (schema as z.ZodString).max(
            rule.value,
            rule.message || `Must be at most ${rule.value} characters`
          );
        }
        break;
      case 'email':
        schema = (schema as z.ZodString).email(rule.message || 'Invalid email address');
        break;
      case 'url':
        schema = (schema as z.ZodString).url(rule.message || 'Invalid URL');
        break;
      case 'pattern':
        if ('value' in rule) {
          try {
            const regex = new RegExp(rule.value);
            schema = (schema as z.ZodString).regex(regex, rule.message || 'Invalid format');
          } catch {
            console.warn(`Invalid regex pattern: ${rule.value}`);
          }
        }
        break;
    }
  }

  if (!isRequired) {
    schema = schema.optional().or(z.literal(''));
  }

  return schema;
}

/**
 * Build a Zod object schema for all fields in a workflow step.
 */
export function buildStepSchema(
  step: WorkflowStepConfig
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of step.fields) {
    shape[field.name] = buildFieldSchema(field);
  }

  return z.object(shape);
}

/**
 * Build Zod schemas for all steps in a workflow.
 */
export function buildWorkflowSchemas(
  config: WorkflowConfig
): z.ZodObject<Record<string, z.ZodTypeAny>>[] {
  return config.steps.map((step) => buildStepSchema(step));
}

/**
 * Extract default values from a workflow step's field configurations.
 */
export function getStepDefaultValues(step: WorkflowStepConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};

  for (const field of step.fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else if (field.type === 'checkbox') {
      defaults[field.name] = false;
    } else if (field.type === 'number') {
      defaults[field.name] = '';
    } else {
      defaults[field.name] = '';
    }
  }

  return defaults;
}
