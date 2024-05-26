import request from "supertest";
import setUpApp from "../../app.js";
import {UserServices} from "../../Services/UserServices.js";
import {TokenServices} from "../../Services/TokenServices.js";
import {Database} from "../../Models/index.js";
import {emptyTables, runMigration, undoAllMigration, useFreshDatabase} from "../../tests/databaseUtils.js";

let app = null
describe("AuthController test routes", () => {
    useFreshDatabase()
    beforeEach(async ()=>{
        app = await setUpApp()
    })

    test("POST /api/register - valid credentials", async () => {
        Database.mock()
        const response =  await request(app)
            .post("/api/register")
            .send({
                firstName: "Test",
                lastName: "User",
                email: "AuthController@email.com",
                password: "password"
            })
            .set('Accept', 'application/json')
        expect(response.statusCode).toBe(200);
    });

    test("POST /api/login - valid credentials", async () => {
        Database.mock()
        UserServices.retrieveUserByEmail = jest.fn((email)=>{
            return {
                id: 1,
                firstName: "Test",
                lastName: "User",
                email,
                password: UserServices.hashPassword("password")
            }
        })
        UserServices.comparePassword = jest.fn(UserServices.comparePassword)
        const response =  await request(app)
            .post("/api/login")
            .send({
                email: "AuthController@email.com",
                password: "password"
            })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(200);
        expect(UserServices.retrieveUserByEmail).toHaveBeenCalled()
        expect(UserServices.comparePassword).toHaveBeenCalled()

        const {accessToken, refreshToken, user} = response.body
        expect(accessToken).toBeDefined()
        expect(refreshToken).toBeDefined()
        expect(user).toBeDefined()
    });

    test("POST /api/me - valid token", async () => {
        Database.mock()

        const userId = Math.floor(Math.random() * 1000)
        const token = await TokenServices.createToken(userId)
        const accessToken = TokenServices.generateAccessToken(token)

        TokenServices.retrieveTokenFromIdentifier = jest.fn((_)=>token)
        TokenServices.retrieveUserFromToken = jest.fn((token)=>({id: token.userId}))

        const response =  await request(app)
            .get("/api/me")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)

        expect(TokenServices.retrieveTokenFromIdentifier.mock.calls[0][0]).toBe(token.identifier)
        expect(TokenServices.retrieveUserFromToken.mock.calls[0][0]).toBe(token)
        expect(response.statusCode).toBe(200);
        expect(response.body?.user?.id).toBe(userId);
    })

    test("POST /api/me - revoked token", async () => {
        TokenServices.retrieveTokenFromIdentifier.mockRestore()
        TokenServices.retrieveUserFromToken.mockRestore()
        UserServices.retrieveUserByEmail.mockRestore()
        Database.unmock()
        await emptyTables()

        const user = await UserServices.registerUser(
            "Test",
            "User",
            "AuthController@email.com",
            "password"
        )

        const token = await TokenServices.createToken(user.id)
        const accessToken = TokenServices.generateAccessToken(token)
        await TokenServices.revokeToken(token)

        const response =  await request(app)
            .get("/api/me")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(401);
    })

    test("POST /api/me - expired token", async () => {
        Database.unmock()
        await emptyTables()

        const user = await UserServices.registerUser(
            "Test",
            "User",
            "AuthController@email.com",
            "password"
        )

        const token = await TokenServices.createToken(user.id)
        token.expireAt = new Date("2021-01-01")
        await token.save()
        const accessToken = TokenServices.generateAccessToken(token)
        const response =  await request(app)
            .get("/api/me")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(401);
    })
});