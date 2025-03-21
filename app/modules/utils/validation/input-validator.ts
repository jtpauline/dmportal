import { 
  ValidationRule, 
  ValidationResult, 
  Validator, 
  ValidationError 
} from './validation-types';

export class InputValidator<T> implements Validator<T> {
  constructor(private rules: ValidationRule<T>) {}

  validate(input: unknown): ValidationResult<T> {
    const result: ValidationResult<T> = {
      isValid: true,
      errors: []
    };

    // Required check
    if (this.rules.required && (input === undefined || input === null)) {
      result.isValid = false;
      result.errors.push('Input is required');
      return result;
    }

    // Type checking
    if (this.rules.type) {
      const typeCheck = this.checkType(input, this.rules.type);
      if (!typeCheck.isValid) {
        result.isValid = false;
        result.errors.push(typeCheck.error);
        return result;
      }
    }

    // Range/length checks
    if (this.rules.min !== undefined) {
      const rangeCheck = this.checkMinMax(input, this.rules.min, this.rules.max);
      if (!rangeCheck.isValid) {
        result.isValid = false;
        result.errors.push(rangeCheck.error);
        return result;
      }
    }

    // Pattern matching
    if (this.rules.pattern) {
      const patternCheck = this.checkPattern(input, this.rules.pattern);
      if (!patternCheck.isValid) {
        result.isValid = false;
        result.errors.push(patternCheck.error);
        return result;
      }
    }

    // Custom validation
    if (this.rules.custom) {
      const customCheck = this.checkCustom(input, this.rules.custom);
      if (!customCheck.isValid) {
        result.isValid = false;
        result.errors.push(customCheck.error);
        return result;
      }
    }

    result.value = input as T;
    return result;
  }

  private checkType(input: unknown, expectedType: string): { isValid: boolean; error?: string } {
    const actualType = typeof input;
    const typeMap: Record<string, string[]> = {
      'string': ['string'],
      'number': ['number'],
      'boolean': ['boolean'],
      'array': ['object'],
      'object': ['object']
    };

    if (!typeMap[expectedType].includes(actualType)) {
      return {
        isValid: false,
        error: `Expected type ${expectedType}, got ${actualType}`
      };
    }

    return { isValid: true };
  }

  private checkMinMax(input: unknown, min: number, max?: number): { isValid: boolean; error?: string } {
    if (typeof input === 'string' || Array.isArray(input)) {
      if (input.length < min) {
        return {
          isValid: false,
          error: `Minimum length is ${min}`
        };
      }
      if (max && input.length > max) {
        return {
          isValid: false,
          error: `Maximum length is ${max}`
        };
      }
    }
    
    if (typeof input === 'number') {
      if (input < min) {
        return {
          isValid: false,
          error: `Minimum value is ${min}`
        };
      }
      if (max !== undefined && input > max) {
        return {
          isValid: false,
          error: `Maximum value is ${max}`
        };
      }
    }

    return { isValid: true };
  }

  private checkPattern(input: unknown, pattern: RegExp): { isValid: boolean; error?: string } {
    if (typeof input === 'string' && !pattern.test(input)) {
      return {
        isValid: false,
        error: 'Input does not match required pattern'
      };
    }
    return { isValid: true };
  }

  private checkCustom(input: unknown, customRule: (value: unknown) => boolean): { isValid: boolean; error?: string } {
    if (!customRule(input)) {
      return {
        isValid: false,
        error: 'Custom validation failed'
      };
    }
    return { isValid: true };
  }
}
