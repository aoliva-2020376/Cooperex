import { verify } from "argon2"
import { encrypt } from "../../util/encrypt.js"
import { generateJwt } from "../../util/jwt.js"
import Admin from "../admin/admin.model.js"

export const login = async (req,res) => {
    try{
        let { userLoggin, password } = req.body

        let admin = await Admin.findOne(
            {
                $or:[
                    { email: userLoggin },
                    { username: userLoggin }
                ]
            }
        )

        if (!admin) {
            return res.status(400).send(
                {
                    message: 'Invalid credentials'
                }
            )
        }

        const passwordMatch = await verify(admin.password, password)
        if (!passwordMatch) {
            return res.status(400).send(
                {
                    message: 'Invalid credentials'
                }
            )
        }

        let loggedUser = {
            uid: admin._id,
            username: admin.username,
            name: admin.name,
            role: admin.role
        }

        let token = await generateJwt(loggedUser)

        return res.send(
            {
                message: `Welcome ${admin.name}`,
                loggedUser,
                token
            }
        )
    } catch (err) {
        console.error(err)
        return res.status(500).send(
            {
                message: 'General error with login function',
                err
            }
        )
    }
}

export const test = (req, res) => {
    console.log('Test is running')
    res.send(
        {
            message: 'Test is running'
        }
    )
}

const agregarAdminPorDefecto = async () => {
    try {
        const defaultAdmin = await Admin.findOne({ role: 'ADMIN' })
    if (!defaultAdmin) {
             const usuarioAdmin = new Admin(
                {
                    name: 'Andrés1 ',
                    surname: 'Oliva1',
                    username: 'aoliva1',
                    email: `${process.env.ADMIN_EMAIL}`,
                    password: await encrypt(`${process.env.ADMIN_PASSWORD}`, 12),
                    phone: '55555555',
                    role: 'ADMIN',
                    status: "ACTIVE"
                }
            )
            await usuarioAdmin.save()
            console.log(" Usuario administrador por defecto agregado")
        }
    }catch (err) {
            console.error("Error al agregar usuario por defecto:", 
            err
        )
    }
}

agregarAdminPorDefecto()
