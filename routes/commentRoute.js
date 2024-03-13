import { createComment } from "../controllers/commentController.js";
import { isUserAuthenticated } from "../middlewares/authentiucate.js";
import  express from "express";
const Router = express.Router()
Router.use(isUserAuthenticated)

Router.post('/create-comment/:postId', createComment)

export default Router

