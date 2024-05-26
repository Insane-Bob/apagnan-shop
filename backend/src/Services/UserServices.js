import bcrypt from "bcryptjs";
import {Database} from "../Models/index.js";
export class UserServices{
    static hashPassword(plainPassword){
        return bcrypt.hashSync(plainPassword, 8);
    }

    static comparePassword(plainPassword, hashedPassword){
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    static registerUser(firstName,lastName, email, password){
        const hashedPassword = this.hashPassword(password);
        return Database.getInstance().models.User.create(
            {
                firstName,
                lastName,
                email,
                password: hashedPassword
            }
        )
    }

    static retrieveUserByEmail(email){
        return Database.getInstance().models.User.findOne({
            where: {
                email
            }
        })
    }
}

