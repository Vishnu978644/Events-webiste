import express from "express";
import { registerUser, loginUser } from "../controller/userController.js";

const userrouter = express.Router();

userrouter.post("/register", registerUser);
userrouter.post("/login", loginUser);

export default userrouter;
