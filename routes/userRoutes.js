import express from 'express';
import { registerUser } from '../controllers/userController.js';
import { upload } from '../middlewares/multerMiddlewares.js';
const Router = express.Router();
Router.post('/register',
    upload.fields([

        {
            name: "image",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser)

export default Router