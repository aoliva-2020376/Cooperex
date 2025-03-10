'use strcit'

import jwt from 'jsonwebtoken'
import { findAdmin } from '../util/db.validators.js'



export const validateJwt = async (req, res, next) => {
    try {
        let secretKey = process.env.SECRET_KEY
        let { authorization } = req.headers
        if (!authorization ) return res.status(401).send(
            {
                message: 'Unauthorized'
            }
        )
        let user = jwt.verify(authorization,secretKey)
        const validateUser = await findAdmin(user.uid)
        if ( !validateUser ) return res.status(404).send(
            {
                success: false,
                message: 'User not found'
            }
        )
        req.user=user
        next()
    } catch (err) {
        console.error(err)
        return res.status(401).send(
            {
                message: 'Invalid credentials'
            }
        )
    }
}