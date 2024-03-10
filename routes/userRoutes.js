import express from 'express';

import { registerUser, loginUser } from '../controllers/userController.js';
import { upload } from '../middlewares/multerMiddlewares.js';


const Router = express.Router();


// API Handler


// Register User
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
    registerUser);


// Login User
Router.post('/login', loginUser);

export default Router