import {Router} from "express"
import { connection } from "../db.js"
import { createUsuario, returnUsuario, updateUsuarioSchema } from "../schemas/usuario.schemas.js"
import { validateDataMiddleware } from "../middleware/validateData.middleware.js"
import jwt from "jsonwebtoken"
import {hashSync} from "bcryptjs"
import { validateTokenMiddleware } from "../middleware/validateToken.middleware.js"
const dadosUsuario = [
    "nome","senha"
]

export const userRoutes = Router()

userRoutes.get("",async (req,res)=>{
    // const users = database.users
    // return res.status(200).json(users)
    const usersDb = await connection.query("select * from cliente;")
    const users = usersDb.rows
    const returnUsers = users.map((user)=>{
        const obj = {}
        for(const key in user){
           // console.log(key,user[key])
            if(returnUsuario.includes(key)){
                obj[key] = user[key]
            }
        }
        return obj
    })
    return res.status(200).json(returnUsers)
})
userRoutes.post("",validateDataMiddleware(createUsuario), async(req,res)=>{
    
    const infos = Object.keys(req.body)
    if(infos.length < dadosUsuario.length){
        return res.status(403).
        json({message:`Dados inválidos, os dados que devem ser enviados são:
             ${dadosUsuario.map((dado)=>dado)}`})
    }
    const user = req.body
  
    const text = 'INSERT INTO cliente(nome, senha) VALUES($1, $2) RETURNING *'
    // const hash = btoa(user.password)
    const hash = hashSync(user.senha,9)

    const values = [user.nome,hash]
    const query = await  connection.query(text,values)
    // await pool.end()
    const returnUser = {}
    for(const key in query.rows[0]){
        if(returnUsuario.includes(key)){
            returnUser[key] = query.rows[0][key]
        }
    }
    return res.status(201).json(returnUser)
})

userRoutes.delete("/:id",async (req,res)=>{
    const text = 'select * from cliente where id = $1'
    const values = [req.params.id]
    const findUser = await connection.query(text,values)
      if(findUser.rows.length === 0){
       return res.status(404).json({message:"Usuário não encontrado"})
    }
    const deleteText = 'delete from cliente where id = $1'
    await connection.query(deleteText,values)
    return res.status(204).send()
})
userRoutes.patch("/:id",validateTokenMiddleware, validateDataMiddleware(updateUsuarioSchema), async (req,res)=>{
    if(req.user.id != parseInt(req.params.id)){
        return res.status(403).json({message:"Permissão insuficiente"})
    } 
    const text = 'select * from cliente where id = $1'
    const values = [req.params.id]
    const findUser = await connection.query(text,values)
      if(findUser.rows.length === 0){
       return res.status(404).json({message:"Usuário não encontrado"})
    }
    const oldUser = findUser.rows[0]
    const obj = {}
    for(const key in req.body){
        if(dadosUsuario.includes(key)){
            obj[key] = req.body[key]
        }
    }
    const updateUser = {
        ...oldUser,
        ...obj, 
    }
    const updateQuery = `update cliente set nome = $2,senha = $3 where id = $1 RETURNING *`
    const uodateValues = [req.params.id,updateUser.name,updateUser.email,updateUser.password]
    const updateUserDb = await connection.query(updateQuery,uodateValues)
    const objUpdate = {}
    for(const key in updateUserDb.rows[0]){
        if(returnUsuario.includes(key)){
            objUpdate[key] = updateUserDb.rows[0][key]
        }
    }
    return res.status(200).json(objUpdate)
})
userRoutes.get("/retrieve",validateTokenMiddleware,(req,res)=>{
    // console.log(req.headers.authorization)
    return res.status(200).json(req.user)
})
userRoutes.get("/:id",async (req,res)=>{
    const text = 'select * from cliente where id = $1'
    const values = [req.params.id]
    const findUser = await connection.query(text,values)
    console.log(findUser,"findUSer")
    if(findUser.rows.length === 0){
       return res.status(404).json({message:"Usuário não encontrado"})
    }
    const user = findUser.rows[0]
    const obj = {}
    for(const key in user){
        if(returnUsuario.includes(key)){
            obj[key] = user[key]
        }
    }
    return res.status(200).json(obj)
    
})