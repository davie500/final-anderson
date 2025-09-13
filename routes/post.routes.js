import {Router} from "express"
import { validateTokenMiddleware } from "../middleware/validateToken.middleware.js"
import { createPerguntaIntoPesquisaController, createPostController, getAllPostsController, getPerguntasByPesquisaController, getPostByUserIdController } from "../controllers/posts.controller.js"
import { validateDataMiddleware } from "../middleware/validateData.middleware.js"
import { createPerguntaIntoPesquisaSchema, createPostSchema } from "../schemas/posts.schemas.js"
import { getUserByIdMiddleware } from "../middleware/getUserById.middleware.js"

export const postRoutes = Router()

// create table post_usuarios (id serial primary key, user_id int, post_id int,
// 	constraint fk_user foreign key(user_id) references usuarios(id),
// 	constraint fk_post foreign key(post_id) references post(id)
// );

postRoutes.post("",validateDataMiddleware(createPostSchema), validateTokenMiddleware,createPostController)
postRoutes.get("",getAllPostsController)
postRoutes.get("/:id",getUserByIdMiddleware, getPostByUserIdController)
postRoutes.post("/:id",validateDataMiddleware(createPerguntaIntoPesquisaSchema),createPerguntaIntoPesquisaController)
postRoutes.get("/:id/perguntas",getPerguntasByPesquisaController)