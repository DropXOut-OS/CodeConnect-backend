import express from "express"
import cors from "cors"

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    Credential: true
}))
app.use(express.json({limit: "8kb"}))
app.use(express.urlencoded({extended: true, limit: "8kb"}))
app.use(express.static("public"))


export {app}