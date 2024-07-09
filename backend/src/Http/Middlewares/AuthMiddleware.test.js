import {AuthMiddleware} from "./AuthMiddleware.js";
import {Request} from "../../Core/Request.js"
import {TokenServices} from "../../Services/TokenServices.js";
import {UnauthorizedException} from "../../Exceptions/HTTPException.js";
describe("AuthMiddleware", () => {
    function generateAccessToken(){
        const expireAt = new Date()
        expireAt.setDate(expireAt.getDate() + 1)
        const accessToken = TokenServices.generateAccessToken({
            expireAt: expireAt,
        })
        return accessToken
    }
    const res = {
        status: jest.fn(),
        send: jest.fn()
    }

    TokenServices.retrieveUserFromToken = jest.fn(()=> ({
        Customer:{}
    }))

    test("No authenticate request",async ()=>{
        const req = new Request({
            headers: {
                authorization: null
            }
        })
        const next = jest.fn()
        const middleware = new AuthMiddleware()
        await middleware.handle(req,res,next)
        expect(next).toHaveBeenCalled()
    })

    test("Authenticate request",async ()=>{
        const expireAt = new Date()
        expireAt.setDate(expireAt.getDate() + 1)
        const accessToken = TokenServices.generateAccessToken({
            expireAt: expireAt,
        })

        const request = new Request({
            headers: {
                authorization: `Bearer ${generateAccessToken()}`
            }
        })
        const next = jest.fn()
        TokenServices.retrieveTokenFromIdentifier = jest.fn(()=>true)


        const middleware = new AuthMiddleware()
        await middleware.handle(request,res,next)
        expect(next).toHaveBeenCalled()
        expect(request.token).toBe(true)
        expect(request.user).toBeDefined()
    })

    test("No existing token",async ()=>{

        const request = new Request({
            headers: {
                authorization: `Bearer ${generateAccessToken()}`
            }
        })
        const next = jest.fn()
        TokenServices.retrieveTokenFromIdentifier = jest.fn(()=> null)

        const middleware = new AuthMiddleware()
        expect(middleware.handle(request,res,next)).rejects.toThrow(UnauthorizedException)
        expect(next).not.toHaveBeenCalled()
    })

    test("No existing user",async ()=>{
        const expireAt = new Date()
        expireAt.setDate(expireAt.getDate() + 1)
        const accessToken = TokenServices.generateAccessToken({
            expireAt: expireAt,
        })

        const request = new Request({
            headers: {
                authorization: `Bearer ${generateAccessToken()}`
            }
        })
        const next = jest.fn()
        TokenServices.retrieveTokenFromIdentifier = jest.fn(()=>true)
        TokenServices.retrieveUserFromToken = jest.fn(()=>null)

        const middleware = new AuthMiddleware()
        expect(middleware.handle(request,res,next)).rejects.toThrow(UnauthorizedException)
        expect(next).not.toHaveBeenCalled()
    })

    test("Invalid token",async ()=> {
        const request = new Request({
            headers: {
                authorization: `Bearer invalid`
            }
        })
        const next = jest.fn()
        const middleware = new AuthMiddleware()
        expect(middleware.handle(request, res, next)).rejects.toThrow(UnauthorizedException)
        expect(next).not.toHaveBeenCalled()
    })
})


