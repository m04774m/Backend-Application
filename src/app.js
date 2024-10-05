import express from 'express'
import cookieParser from 'cookie-parser'
import cors from  'cors'



const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"})) //connfiguring to accept  JSON files
app.use(express.urlencoded({extended:true,limit:"16kb"})) //to encode url
app.use(express.static("public")) //to store files or folder
app.use(cookieParser()) //to perform crud operation in user browser

//routes import
import userRouter from './routes/user.routes.js'

// routes declaration
app.use("/api/v1/users",userRouter)

// http:localhost:8000/api/v1/users/register

export {app}