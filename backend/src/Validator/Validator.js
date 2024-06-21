// Validator.js
import { z } from 'zod'
import { ValidationException } from '../Exceptions/ValidationException.js'

export class Validator {
    constructor(schema) {
        this.schema = schema
    }

    validate(data) {
        try {
            return this.schema.parse(data)
        } catch (e) {
            if (e instanceof z.ZodError) {
                const pathsWithErrors = e.errors.map((error) =>
                    error.path.join('.'),
                )
                const errors = pathsWithErrors.map((path) => ({
                    path,
                    message: e.errors.find(
                        (error) => error.path.join('.') === path,
                    ).message,
                }))
                throw new ValidationException(errors)
            } else {
                throw e
            }
        }
    }
}
