import express from "express";

// Middlewares
import { upload } from "../middlewares/multerMiddlewares.js";

// Controllers
import {
  registerUser,
  loginUser,
  logoutUser,
  deleteAccount,
  updateProfileImage,
  updateCoverImage,
} from "../controllers/userController.js";
import { isUserAuthenticated } from "../middlewares/authentiucate.js";

const Router = express.Router();

// API Handler

// Register User
Router.post(
  "/register",
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "coverimage",
      maxCount: 1,
    },
  ]),
  registerUser
);

// Login User
Router.post("/login", loginUser);
Router.post("/logout", logoutUser);

updateCoverImage;
//protected route
Router.patch(
  "/profile-image-update",
  isUserAuthenticated,
  upload.single("image"),
  updateProfileImage
);
Router.patch(
  "/cover-image-update",
  isUserAuthenticated,
  upload.single("coverimage"),
  updateCoverImage
);
Router.delete("/delete-account/:id", isUserAuthenticated, deleteAccount);

export default Router;
