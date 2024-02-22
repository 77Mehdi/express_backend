
import jwt from "jsonwebtoken"
import ENV from "../config.js"

export default async function Auth(req, res, next) {

    try {

        const token = req.headers.authorization.split(" ")[1];

        const decodetoken = await jwt.verify(token, ENV.JWT_SECRET)
        req.user = decodetoken

        next()
    } catch (error) {
        return res.status(401).json({ error: "authorsetion Fild" })
    }
}


export function localVariable(req, res, next) {
    req.app.locals = {
        OTP: null,
        resetSession: false
    }

    next()
} 