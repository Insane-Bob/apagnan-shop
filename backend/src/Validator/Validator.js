// Validator.js
import { z } from 'zod';
import { ValidationException } from '../Exceptions/ValidationException';

export class Validator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(data) {
    try {
      this.schema.parse(data);
    } catch (e) {
      if (e instanceof z.ZodError) {
        const errors = e.errors.map(err => ({
          path: err.path,
          message: err.message,
        }));
        throw new ValidationException(errors);
      } else {
        throw e;
      }
    }
  }
}
