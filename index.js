import dotenv from "dotenv";
import connectDB from "./config/database.js";
import { app } from "./app.js";

dotenv.config({
  path: ".env",
});

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
  
  
  