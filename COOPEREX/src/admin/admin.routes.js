import { Router } from "express"
import { validateJwt } from "../../middlewares/validate.jwt.js"
import { login, test } from "./admin.controller.js"



const api = Router()

api.post('/login',
    login
)

api.get('/test',
    [
        validateJwt
    ],
    test
)

export default api