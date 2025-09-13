import { connection } from "../db.js"

export const getUserByIdMiddleware=async(req,res,next)=>{
    const userId = parseInt(req.params.id)
    const text = `SELECT * FROM cliente where id = $1`
    const values = [userId]
    const resDb = await connection.query(text,values)
    if(resDb.rows.length===0){
        return res.status(404).json({message:"Usuário não encontrado"})
    }
    next()
}