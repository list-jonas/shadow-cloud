import express, { Router } from "express";
import { authenticateUser } from "../middleware/authentication";
import adminController from "../controller/adminController";

const adminRouter: Router = express.Router();

adminRouter.get("/users", authenticateUser(), adminController.getUsers);
adminRouter.get("/add_user", authenticateUser(), adminController.addUser);
adminRouter.get("/edit_user", authenticateUser(), adminController.editUser);
adminRouter.get("/delete_user", authenticateUser(), adminController.deleteUser);

export default adminRouter;