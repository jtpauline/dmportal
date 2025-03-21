// Core validation interfaces and types
export type ValidationRule<T> = {
  required?: boolean;
  type?: 'string' | 'number' | 'boolean' | 'array' | 'object';
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => boolean;
}

export interface ValidationResult<T> {
  isValid: boolean;
  errors: string[];
  value?: T;
}

export interface Validator<T> {
  validate(input: unknown): ValidationResult<T>;
}

export class ValidationError extends Error {
  constructor(
    public code: string, 
    public details: Record<string, unknown>
  ) {
    super('Validation Failed');
    this.name = 'ValidationError';
  }
}
