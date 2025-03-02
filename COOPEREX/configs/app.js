'use strict'

import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import dotenv from 'dotenv'
import { limiter } from '../middlewares/rate.limit.js'

import adminRoutes from '../src/admin/admin.routes.js'
import companyRoutes from '../src/company/company.routes.js'

dotenv.config()

const configs = (app) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cors())
    app.use(helmet())
    app.use(morgan('dev'))
    app.use(limiter)
}

const routes = (app) => {
    app.use('/v1/admin', adminRoutes )
    app.use('/v1/companies', companyRoutes)
}



export const initServer = () => {
    const app = express()
    try {
        configs(app)
        routes(app)
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`)
        }
    )
    } catch (err) {
        console.error('Server init failed',
            err
        )
    }
}