import { connection } from "../db.js"

import { createPerguntaSchema } from "../schemas/pergunta.schemas.js"

export const createPerguntaController = async(req,res)=>{
    const bodyValues = Object.values(req.body)
    if(bodyValues.length < createPerguntaSchema.length){
        return res.status(403).json({message:`Dados inválidos: os dados necessários são: ${createPerguntaSchema}`})
    }
    const text = 'INSERT INTO perguntas(nome, descricao,numero_quest) values($1, $2,$3) RETURNING *'
    const resPergunta = await connection.query(text,bodyValues)
    const createPergunta = resPergunta.rows[0]

    return res.status(201).json({...createPergunta})
}
export const getAllPerguntasController=async(req,res)=>{
   
    try {
        const text = `
            SELECT * from perguntas ;
        `;

        const resDb = await connection.query(text);
        return res.status(200).json(resDb.rows);
    }
    catch (error) {
        console.error('Erro ao buscar posts:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}
export const getPerguntaByUserIdController=async(req,res)=>{
    const userId = parseInt(req.params.id)
    const text = `SELECT 
            c.id , u.user_id , c."content" , c."name" 
            FROM post_usuarios u
            JOIN post c
            ON u.post_id   = c.id
            where u.user_id = $1;`
    const values= [userId]
    const resDb = await connection.query(text,values)

    return res.status(200).json(resDb.rows)
}