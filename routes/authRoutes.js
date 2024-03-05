import express from 'express';
const router = express.Router();

// Controllers
import { register } from '../controllers/authController.js';





// API Handler
router.post('/register', register);




export default router;