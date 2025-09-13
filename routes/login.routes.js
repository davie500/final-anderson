import {Router} from "express"
import { connection } from "../db.js"
import { validateDataMiddleware } from "../middleware/validateData.middleware.js"
import { createLoginSchema } from "../schemas/login.schemas.js"
import jwt from "jsonwebtoken"
import {compare} from "bcryptjs"
export const loginRoutes = Router()

loginRoutes.post("",validateDataMiddleware(createLoginSchema), async (req,res)=>{
    console.log(req.body,"login")
    const infos = Object.keys(req.body)
    if(infos.length < createLoginSchema.length){
        return res.status(403).json({message:`Dados inválidos, os dados que devem ser enviados são:
            ${createLoginSchema.map((dado)=>dado)}`})
    }
    const text = 'select * from cliente where nome = $1'
    const values = [req.body.nome]
    
    const userDb = await connection.query(text,values)
    const user = userDb.rows[0]
    const descrypt = await compare(req.body.senha,user.senha)
    console.log(descrypt,"decrypt")
    if(descrypt){
        const token = jwt.sign({
            id:user.id,
            nome:user.nome,
        },
        process.env.secret_key,
        {
            expiresIn:"24h",
            subject:String(user.id)
        }
    )
        return res.status(201).json({...user,token,} )
    }
    return res.status(403).json({message:"Nome ou senha inválidos"})
})