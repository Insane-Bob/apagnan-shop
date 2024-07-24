import { UnprocessableEntity } from './HTTPException.js'

export class ValidationException extends UnprocessableEntity {
    constructor(errors) {
        super('Validation Error')
        this.errors = errors
    }

    static abort(message = undefined) {
        throw new this(message)
    }

    toJSON() {
        return {
            ...super.toJSON(),
            errors: this.errors,
        }
    }
}
