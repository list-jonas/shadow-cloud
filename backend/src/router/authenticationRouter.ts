import express, { Router } from "express";
import authenticationController from "../controller/authenticationController";
import { authenticateUser } from "../middleware/authentication";

const authenticationRouter: Router = express.Router();

//Normal login/registration
authenticationRouter.post("/login", authenticationController.postLogin);
authenticationRouter.get("/checkSession", authenticateUser(), authenticationController.checkSession);

// Handles logout
authenticationRouter.post("/logout", authenticationController.handleLogout);

export default authenticationRouter;