import {Router} from "express"
import { validateTokenMiddleware } from "../middleware/validateToken.middleware.js"
import { createPerguntaIntoPesquisaController, createPesquisaController, getAllPesquisasController, getPerguntasByPesquisaController, getPesquisaByUserIdController,  } from "../controllers/pesquisas.controller.js"
import { validateDataMiddleware } from "../middleware/validateData.middleware.js"
import { createPerguntaIntoPesquisaSchema, createPesquisaSchema,  } from "../schemas/pesquisa.schemas.js"
import { getUserByIdMiddleware } from "../middleware/getUserById.middleware.js"

export const pesquisaRoutes = Router()

// create table post_usuarios (id serial primary key, user_id int, post_id int,
// 	constraint fk_user foreign key(user_id) references usuarios(id),
// 	constraint fk_post foreign key(post_id) references post(id)
// );

pesquisaRoutes.post("",validateDataMiddleware(createPesquisaSchema), validateTokenMiddleware,createPesquisaController)
pesquisaRoutes.get("",getAllPesquisasController)
pesquisaRoutes.get("/:id",getUserByIdMiddleware, getPesquisaByUserIdController)
pesquisaRoutes.post("/:id",validateDataMiddleware(createPerguntaIntoPesquisaSchema),createPerguntaIntoPesquisaController)
pesquisaRoutes.get("/:id/perguntas",getPerguntasByPesquisaController)