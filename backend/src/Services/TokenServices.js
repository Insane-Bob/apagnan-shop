import {Database} from "../Models/index.js";
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import fs from "fs";
import path from "path";
export class TokenServices{
    static retrieveUserFromToken(token){
        return Database.getInstance().models.User.findOne({
            where: {
                id: token.userId
            }
        })
    }

    static retrieveTokenFromIdentifier(tokenIdentifier){
        return Database.getInstance().models.Token.findOne({
            where: {
                identifier: tokenIdentifier,
                revoked: false
            }
        })
    }

    static retrieveTokenFromRefreshToken(refreshToken){
        return Database.getInstance().models.Token.findOne({
            where: {
                refreshToken: refreshToken,
                revoked: false
            }
        })
    }

    static async revokeToken(token){
        token.revoked = true
        await token.save()
    }

    static async createToken(userId){
        const expireAt = new Date()
        // eslint-disable-next-line no-undef
        expireAt.setDate(expireAt.getDate() + Number(process.env.TOKEN_EXPIRATION || 1))
        expireAt.setMilliseconds(0)
        const identifier = await this.generateUniqueIdentifier()
        const refreshToken = await this.generateUniqueRefreshToken()
        const token = await Database.getInstance().models.Token.create({
            identifier,
            userId,
            expireAt,
            refreshToken
        })
        return token
    }

    static async generateUniqueIdentifier(){
        let attempts = 0
        do{
            const identifier = crypto.randomBytes(32).toString('hex')
            const token = await this.retrieveTokenFromIdentifier(identifier)

            if(!token) {
                return identifier
            }
            attempts++
        }while (attempts < 20)
        throw new Error("Could not generate a unique token")
    }
    static async generateUniqueRefreshToken(){
        let attempts = 0
        do{
            const identifier = crypto.randomBytes(64).toString('hex')
            const token = await this.retrieveTokenFromRefreshToken(identifier)
            if(!token) {
                return identifier
            }
            attempts++
        }while (attempts < 20)
        throw new Error("Could not generate a unique token")
    }
    static generateAccessToken(token){
        // eslint-disable-next-line no-undef
        const privateKey = fs.readFileSync(path.resolve( 'private.key'))
        const exp = Math.round(token.expireAt.getTime() / 1000)
        return jwt.sign({id: token.identifier,exp:exp}, privateKey.toString(),{algorithm: 'RS256'})
    }

    static verifyAccessToken(token){
        // eslint-disable-next-line no-undef
        const publicKey = fs.readFileSync(path.resolve( 'public.key'))
        return jwt.verify(token, publicKey.toString())
    }
}