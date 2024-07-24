// Validator.js
import { z } from 'zod'
import { ValidationException } from '../Exceptions/ValidationException.js'
import xss from 'xss'

export class Validator {
    constructor(schema) {
        this.schema = schema
    }

    beforeValidation(request) {}
    afterValidation(payload) {}

    sanitizePayload(payload) {
        if (typeof payload === 'string') {
            return xss(payload)
        } else if (Array.isArray(payload)) {
            return payload.map((item) => this.sanitizePayload(item))
        } else if (payload instanceof Date) {
            return payload
        } else if (typeof payload === 'object' && payload !== null) {
            const sanitizedObject = {}
            for (const key in payload) {
                if (payload.hasOwnProperty(key)) {
                    sanitizedObject[key] = this.sanitizePayload(payload[key])
                }
            }
            return sanitizedObject
        }

        return payload
    }

    validate(data) {
        try {
            let payload = this.schema.parse(data)
            return this.sanitizePayload(payload)
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
