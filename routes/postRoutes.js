import express from 'express';
import { upload } from '../middlewares/multerMiddlewares.js';
import { createPost } from '../controllers/postController.js';
import { isUserAuthenticated } from '../middlewares/authentiucate.js';


const Router = express.Router();
Router.post('/create-post', upload.fields([
    {
        name: "image",
        maxCount: 1
    }
]), isUserAuthenticated, createPost)
export default Router