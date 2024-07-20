import {useFreshDatabase} from "../tests/databaseUtils.js";
import {UserServices} from "./UserServices.js";
import {TokenServices} from "./TokenServices.js";
import { PaymentServices } from './PaymentServices.js'

describe("UserServices", () => {
    useFreshDatabase()

    beforeEach(() => {
        PaymentServices.createCustomer = jest.fn()
    })
    afterEach(()=>{
        PaymentServices.createCustomer.mockRestore()
    })

    test("registerUser", async () => {
        let user = await UserServices.registerUser(
            "Test",
            "User",
            "UserServices2@email.com",
            "password"
        )

        expect(PaymentServices.createCustomer.mock.calls.length).toBe(1)
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
