import express, { Router } from "express";
import { authenticateUser } from "../middleware/authentication";
import adminController from "../controller/adminController";

const adminRouter: Router = express.Router();

adminRouter.get("/users", authenticateUser(), adminController.getUsers);
adminRouter.post("/add_user", authenticateUser(), adminController.addUser);
adminRouter.put("/edit_user/:id", authenticateUser(), adminController.editUser);
adminRouter.delete("/delete_user/:id", authenticateUser(), adminController.deleteUser);

export default adminRouter;