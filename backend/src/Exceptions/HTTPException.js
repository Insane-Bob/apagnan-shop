export class HTTPException extends Error {
    constructor(message, status) {
        super(message)
        this.status = status
    }

    static abort(message = undefined) {
        throw new this(message)
    }

    static abortIf(condition, message = undefined) {
        if (condition) this.abort(message)
    }

    toJSON() {
        return {
            message: this.message,
            status: this.status,
        }
    }
}

export class NotFoundException extends HTTPException {
    constructor(message = 'Not Found') {
        super(message, 404)
    }
}

export class UnauthorizedException extends HTTPException {
    constructor(message = 'Unauthorized') {
        super(message, 401)
    }
}

export class ForbiddenException extends HTTPException {
    constructor(message = 'Forbidden') {
        super(message, 403)
    }
}

export class BadRequestException extends HTTPException {
    constructor(message = 'Bad Request') {
        super(message, 400)
    }
}

export class InternalError extends HTTPException {
    constructor(message = 'Internal Server Error') {
        super(message, 500)
    }
}

export class UnprocessableEntity extends HTTPException {
    constructor(message = 'Unprocessable Entity') {
        super(message, 422)
    }
}
