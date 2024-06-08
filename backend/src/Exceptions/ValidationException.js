import { UnprocessableEntity } from './HTTPException.js'

export class ValidationException extends UnprocessableEntity {
    constructor(errors) {
        super('Validation Error')
        this.errors = errors
    }

    toJSON() {
        return {
            ...super.toJSON(),
            errors: this.errors,
        }
    }
}
