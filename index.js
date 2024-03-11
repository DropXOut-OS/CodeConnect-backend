import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { app } from "./app.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
dotenv.config({
  path: ".env",
});


// user routes
  app.use('/api/v1/user', userRouter)
  app.use('/api/v1/post', postRouter)

// Variables
const port = process.env.PORT || 5000;

// MongoDb connection
connectDB()
  .then(() => {
    app.listen(port, () => {
        console.log(`http://localhost:${port}`);
      });
  })
  .catch((err) => console.log(`mongodb connection failed${err}`));
  
  

