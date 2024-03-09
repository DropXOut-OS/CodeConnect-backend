import express from 'express';
import { registerUser } from '../controllers/userController.js';
const Router = express.Router();


// API Handlers
Router.post('/register', registerUser);
Router.post('/login', loginUser);

export default Router