import express from "express";
import * as UserController from "../controllers/user.controller.js";
import catchAsync from "../utils/catchAsync.js";
import checkPermission from "./../middlewares/checkPersmission.js";

const router = express.Router();

router
  .route("/")
  .get(checkPermission("view_user"), catchAsync(UserController.getAllUsers))
  .post(checkPermission("create_user"), catchAsync(UserController.createUser));

router
  .route("/:id")
  .get(checkPermission("view_user"), catchAsync(UserController.getUserById))
  .patch(checkPermission("update_user"), catchAsync(UserController.updateUser))
  .delete(
    checkPermission("delete_user"),
    catchAsync(UserController.deleteUser),
  );

export default router;
