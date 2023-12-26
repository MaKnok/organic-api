import express from "express";
import db from "./config/dbConnect.js";
import routes from "./routes/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();


db.on("error", console.log.bind(console,"Connection error"));
db.once("open", ()=>{
    console.log("Connection successfully established");
})

const app = express();

const corsOptions = {
    origin: 'http://organic-shop-app.s3-website-sa-east-1.amazonaws.com',  
    credentials: true,
  };

app.use(
    express.json(),
    cors(corsOptions), 
    cookieParser(),
    (req, res, next) => {
        // Set CORS headers
        res.header('Access-Control-Allow-Origin', corsOptions.origin);
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        res.header('Access-Control-Allow-Credentials', 'true');
    
        // Handle pre-flight requests
        if (req.method === 'OPTIONS') {
          res.status(200).end();
        } else {
          next();
        }
      });

app.options('*', cors(corsOptions));
    
routes(app);

export default app