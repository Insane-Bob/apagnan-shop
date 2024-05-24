import request from "supertest";
import setUpApp from "../../app.js";
import process from "process";
import {spawnSync} from "child_process";
import {UserServices} from "../../Services/UserServices.js";
import {TokenServices} from "../../Services/TokenServices.js";

let app = null
describe("AuthController test routes", () => {
    beforeEach(async ()=>{
        process.env.NODE_ENV = "test"
        spawnSync("npx", ["sequelize-cli", "db:migrate:undo:all"], {stdio: "inherit"})
        spawnSync("npx", ["sequelize-cli", "db:migrate"], {stdio: "inherit"})
        app = await setUpApp()
    })

    test("POST /api/register - valid credentials", async () => {
        const response =  await request(app)
            .post("/api/register")
            .send({
                firstName: "Test",
                lastName: "User",
                email: "test@email.com",
                password: "password"
            })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(200);
    });

    test("POST /api/login - valid credentials", async () => {
        await UserServices.registerUser(
            "Test",
            "User",
            "test@email.com",
            "password"
        )

        const response =  await request(app)
            .post("/api/login")
            .send({
                email: "test@email.com",
                password: "password"
            })
            .set('Accept', 'application/json')

        expect(response.statusCode).toBe(200);
        const {accessToken, refreshToken, user} = response.body
        expect(accessToken).toBeDefined()
        expect(refreshToken).toBeDefined()
        expect(user).toBeDefined()
    });

    test("POST /api/me - valid token", async () => {
        const user = await UserServices.registerUser(
            "Test",
            "User",
            "test@email.com",
            "password"
        )

        const token = await TokenServices.createToken(user.id)
        const accessToken = TokenServices.generateAccessToken(token)

        const response =  await request(app)
            .get("/api/me")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(200);
        expect(response.body?.user?.id).toBe(user.id)
    })

    test("POST /api/me - revoked token", async () => {
        const user = await UserServices.registerUser(
            "Test",
            "User",
            "test@email.com",
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
        const user = await UserServices.registerUser(
            "Test",
            "User",
            "test@email.com",
            "password"
        )

        const token = await TokenServices.createToken(user.id)
        token.expireAt = new Date("2021-01-01")
        await token.save()
        const accessToken = TokenServices.generateAccessToken(token)
        console.log(accessToken)
        const response =  await request(app)
            .get("/api/me")
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${accessToken}`)
        expect(response.statusCode).toBe(401);
    })
});