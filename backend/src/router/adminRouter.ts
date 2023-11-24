import express, { Router } from "express";
import { authenticateUser } from "../middleware/authentication";
import adminController from "../controller/adminController";
import statsController from "../controller/statsController";

const adminRouter: Router = express.Router();

adminRouter.get("/users", authenticateUser(), adminController.getUsers);
adminRouter.post("/add_user", authenticateUser(), adminController.addUser);
adminRouter.put("/edit_user/:id", authenticateUser(), adminController.editUser);
adminRouter.delete("/delete_user/:id", authenticateUser(), adminController.deleteUser);
adminRouter.get("/stats", authenticateUser(), statsController.getStats);

export default adminRouter;