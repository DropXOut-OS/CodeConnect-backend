import express from "express";
const Router = express.Router()

import { createComment, updateComment, deleteComment } from "../controllers/commentController.js";
import { isUserAuthenticated } from "../middlewares/authentiucate.js";

Router.use(isUserAuthenticated)

Router.post('/create-comment/:postId', createComment);
Router.put('/update-comment/:postId', updateComment);
Router.delete('/delete-comment/:postId', deleteComment);

export default Router

