import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/database.js';

dotenv.config({
    path: '.env',
});




// Variables
const app = express();
const port = process.env.PORT || 5000;


// MongoDb connection
connectDB();



// Middlewares 
app.use(express.json());
app.use('/api/v1/auth', authRoutes);



// Home Page API
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'This is Home Page API for CodeConnect application.',
    })
})

// App listener
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})