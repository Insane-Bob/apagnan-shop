import { z } from "zod";
import { Validator } from "./Validator/Validator";

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export class LoginValidator extends Validator {
    constructor() {
        super(loginSchema);
    }
}