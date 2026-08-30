import express from 'express';
import dotenv from "dotenv";
import cors from "cors";
import { clerkMiddleware ,requireAuth} from '@clerk/express'
import airouter from './routes/ai.routes.js';
import connectCloudinary from './config/cloudinary.js';
import userRoutes from './routes/user.routes.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;


await connectCloudinary();


app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());



app.get('/' ,(req,res)=>
    res.send("Server is live!...")
)
app.use(requireAuth());
app.use('/api/ai',airouter);
app.use('/api/user' , userRoutes)

app.listen(PORT , ()=>{
    console.log(`Port listen on : ${PORT}`);
})