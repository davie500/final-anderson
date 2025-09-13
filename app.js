import "dotenv/config"
import express from "express";
import { userRoutes } from "./routes/user.routes.js";
import { loginRoutes } from "./routes/login.routes.js";
import { pesquisaRoutes } from "./routes/pesquisa.routes.js";
import cors from "cors"
import { perguntasRoutes } from "./routes/perguntas.routes.js";
const app = express()

app.use(cors())
app.use(express.static('paginas'));

app.use(express.json())
app.use("/user",userRoutes)
app.use("/login",loginRoutes)
app.use("/pesquisa",pesquisaRoutes)
app.use("/perguntas",perguntasRoutes)

export default app