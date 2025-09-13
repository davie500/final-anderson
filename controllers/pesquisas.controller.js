import { connection } from "../db.js"
import { createPerguntaIntoPesquisaSchema, createPesquisaSchema,  } from "../schemas/pesquisa.schemas.js"

export const createPesquisaController=async(req,res)=>{
    const bodyValues = Object.values(req.body)
    if(bodyValues.length < createPesquisaSchema.length){
        return res.status(403).json({message:`Dados inválidos: os dados necessários são: ${createPesquisaSchema}`})
    }
    const text = 'INSERT INTO pesquisa(nome) values($1) RETURNING *'
    const resPesquisa = await connection.query(text,bodyValues)
    const createPesquisa = resPesquisa.rows[0]
   // const text2 = 'INSERT INTO post_usuarios(user_id,post_id) values($1, $2)'
    //const values = [req.user.id, createPost.id]
   // await connection.query(text2,values)

    return res.status(201).json({...createPesquisa})
}
export const getAllPesquisasController=async(req,res)=>{
   
    try {
        const text = `
            SELECT 
                c.id, u.user_id , c."content" , c."name" 
            FROM post_usuarios u
            JOIN post c ON u.post_id = c.id;
        `;

        const resDb = await connection.query(text);
        return res.status(200).json(resDb.rows);
    }
    catch (error) {
        console.error('Erro ao buscar posts:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
    }
}
export const getPesquisaByUserIdController=async(req,res)=>{
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
export const createPerguntaIntoPesquisaController = async(req,res)=>{
    const pesquisaId = parseInt(req.params.id)
    const bodyValues = Object.values(req.body)
    if(bodyValues.length < createPerguntaIntoPesquisaSchema.length){
        return res.status(403).json({message:`Dados inválidos: os dados necessários são: ${createPerguntaIntoPesquisaSchema}`})
    }
    const text = `insert into quest_pesquisa (pesquisa_id,pergunta_id) values($1,$2)`
    // console.log(bodyValues,req.body)
    const values= [pesquisaId,req.body.perguntas]
    const resDb = await connection.query(text,values)
    return res.status(200).json(resDb.rows)
}
export const getPerguntasByPesquisaController=async(req,res)=>{
    const pesquisaId = parseInt(req.params.id)
    const text = `SELECT 
            p.id AS pergunta_id,
            p.nome AS pergunta_nome,
            p.descricao,
            p.numero_quest
            FROM quest_pesquisa qp
            JOIN Perguntas p ON qp.pergunta_id = p.id
            WHERE qp.pesquisa_id = $1;`
    const values= [pesquisaId]
    const resDb = await connection.query(text,values)

    return res.status(200).json(resDb.rows)
}