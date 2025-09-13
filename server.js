import app from "./app.js";

const port = 3333
app.listen(port,()=>{
    const url = `http://localhost:${port}/homeinicial.html`;
    console.log(`Server is running on ${url}`);
})