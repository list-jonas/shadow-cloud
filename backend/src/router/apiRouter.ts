import express, { Router } from "express";
import { authenticateUser } from "../middleware/authentication";
import apiController from "../controller/apiController";
import { upload } from "../middleware/multerConfig";

const apiRouter: Router = express.Router();

apiRouter.post("/upload", authenticateUser(), upload.array('files[]', 12), apiController.postUpload);

export default apiRouter;