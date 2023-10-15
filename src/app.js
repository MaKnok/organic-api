import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";

db.on("error", console.log.bind(console,"Connection error"));
db.once("open", ()=>{
    console.log("Connection successfully established");
})

const app = express();
app.use(
    express.json(),
    cors(
        {
            credentials: true,
            origin: "http://localhost:4200"
        }), 
    cookieParser());
    
routes(app);

export default app