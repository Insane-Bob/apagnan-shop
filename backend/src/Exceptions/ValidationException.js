import { UnprocessableEntity } from "./HTTPException";

export class VAlidationException extends UnprocessableEntity {
  constructor(errors) {
    super(errors);
  }

  toJSON() {
    return {
      status: this.status,
      message: this.message,
      errors: this.errors,
    };
  }
}