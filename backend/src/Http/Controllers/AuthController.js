import { Controller } from "../../Core/Controller.js";
import {
  UnauthorizedException,
  UnprocessableEntity,
} from "../../Exceptions/HTTPException.js";
import { UserServices } from "../../Services/UserServices.js";
import { TokenServices } from "../../Services/TokenServices.js";
import { z } from "zod";


// @TODO : Use our custom Validator when it'll be merged
export class AuthController extends Controller {
  static schema = z.object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    firstName: z.string().min(2),
    lastName: z.string().min(2),
  });

  async login() {
    const { email, password } = this.req.body.all();

    const loginSchema = AuthController.schema.pick({
      email: true,
      password: true,
    });
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors = result.error.errors.map((error) => error.message);
      throw new UnprocessableEntity(errors.join(", "));
    }

    const user = await UserServices.retrieveUserByEmail(email);
    UnprocessableEntity.abortIf(!user, "Invalid credentials");
    UnprocessableEntity.abortIf(
      !UserServices.comparePassword(password, user.password)
    );

    const token = await TokenServices.createToken(user.id);
    const accessToken = TokenServices.generateAccessToken(token);

    this.res.json({
      accessToken,
      refreshToken: token.refreshToken,
      user,
    });
  }

  async register() {
    const { firstName, lastName, email, password } = this.req.body.all();

    const result = AuthController.schema.safeParse({
      firstName,
      lastName,
      email,
      password,
    });
    if (!result.success) {
      const errors = result.error.errors.map((error) => error.message);
      throw new UnprocessableEntity(errors.join(", "));
    }

    const user = await UserServices.registerUser(
      firstName,
      lastName,
      email,
      password
    );
    this.res.json(user);
  }

  async logout() {
    UnauthorizedException.abortIf(
      !this.req.user || !this.req.token,
      "User is not authenticated"
    );
    await TokenServices.revokeToken(this.req.token);
    this.res.json({ message: "User logged out", success: true });
  }

  async refreshToken() {
    const { refreshToken } = this.req.body.all();

    const token =
      await TokenServices.retrieveTokenFromRefreshToken(refreshToken);
    UnauthorizedException.abortIf(!token, "Refresh token is invalid");

    const user = await TokenServices.retrieveUserFromToken(token);
    UnprocessableEntity.abortIf(!user, "Refresh token is invalid");

    const expireAt = new Date(token.expireAt);
    expireAt.setDate(
      expireAt.getDate() + Number(process.env.REFRESH_TOKEN_EXPIRATION || 30)
    ); //eslint-disable-line no-undef
    UnauthorizedException.abortIf(
      expireAt < new Date(),
      "Refresh token has expired"
    );

    const newToken = await TokenServices.createToken(user.id);
    await TokenServices.revokeToken(token);

    this.res.json({
      accessToken: TokenServices.generateAccessToken(newToken),
      refreshToken: newToken.refreshToken,
    });
  }

  me() {
    UnauthorizedException.abortIf(!this.req.user, "User is not authenticated");
    this.res.json({
      user: this.req.user,
    });
  }
}
