'use strict'

import { hash, verify } from "argon2"



export const encrypt = async (password) => {
    try {
        return await hash(password)
    } catch (err) {
        console.error(err)
        return err
    }
}
