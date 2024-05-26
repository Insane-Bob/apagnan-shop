import {useFreshDatabase} from "../tests/databaseUtils.js";
import {UserServices} from "./UserServices.js";
import {TokenServices} from "./TokenServices.js";

describe("UserServices", () => {
    useFreshDatabase()

    test("registerUser", async () => {
        let user = await UserServices.registerUser(
            "Test",
            "User",
            "UserServices2@email.com",
            "password"
        )
        expect(user).toBeDefined()
        expect(user.firstName).toBe("Test")
        expect(user.lastName).toBe("User")
        expect(user.email).toBe("UserServices2@email.com")
        expect(user.password).not.toBe("password")

    });

    test("retrieveUserByEmail", async () => {
        let user = await UserServices.registerUser(
            "Test",
            "User",
            "UserServices1@email.com",
            "password"
        )
        const userFromEmail = await UserServices.retrieveUserByEmail(user.email)
        expect(userFromEmail).toBeDefined()
        expect(userFromEmail.id).toBe(user.id)
    });
})
