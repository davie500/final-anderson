import { Router } from "express"
import { validateDataMiddleware } from "../middleware/validateData.middleware.js"
import { createPerguntaSchema } from "../schemas/pergunta.schemas.js"
import { createPerguntaController, getAllPerguntasController } from "../controllers/perguntas.controller.js"


export const perguntasRoutes = Router()

perguntasRoutes.post("",validateDataMiddleware(createPerguntaSchema),createPerguntaController)
perguntasRoutes.get("",getAllPerguntasController)