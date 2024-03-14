import { createComment, deleteComment } from "../controllers/commentController.js";
import { isUserAuthenticated } from "../middlewares/authentiucate.js";
import  express from "express";
const Router = express.Router()
Router.use(isUserAuthenticated)

Router.post('/create-comment/:postId', createComment)
Router.delete('/delete-comment/:commentId', deleteComment)

export default Router

