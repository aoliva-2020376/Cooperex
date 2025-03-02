import { Router } from "express";
import {
    validateJwt
} from "../../middlewares/validate.jwt.js";
import { 
    getCompanies, 
    getCompanyById,
    createCompany, 
    updateCompany,
    generateReport
    
} from "./company.controller.js";

const api = Router()

api.get('/',
    [
        validateJwt
    ],
    getCompanies
)


api.post('/create',
    [
        validateJwt
    ],
    createCompany
)

api.get('/generarReporte',
    [
        generateReport
    ],
    generateReport
)

api.get('/:id',
    [
        validateJwt
    ],
    getCompanyById
)

api.put('/update/:id',
    [
        validateJwt
    ],
    updateCompany
)



export default api;
