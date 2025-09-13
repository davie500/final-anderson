import jwt from "jsonwebtoken"
export const validateTokenMiddleware=(req,res,next)=>{
        if(!req.headers.authorization){
            return res.status(400).json({message:"Necessita autenticação"})
        }
     const token = req.headers.authorization.split(" ")[1]
        // console.log(token,"token")
        jwt.verify(token,process.env.secret_key,(erro,decoded)=>{
            console.log(decoded,"decoded")
            if(erro){
                return res.status(401).json({message:erro.message})
            }
            req.user = {...decoded}
        })
            // return res.status(200).json({...decoded})
        next()
}