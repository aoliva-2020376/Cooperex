import { validateResult } from "express-validator"

export const validateErrors = (req, res, next) => {
    const errors = validateResult(req)
    if (!errors.isEmpty()){
        return res.status(400).send(
            {
                success: false,
                message: 'Error with validations',
                errors: errors.errors
            }
        )
    }
    next()
}