import express from "express";
import * as PermissionController from "../controllers/permission.controller.js";
import checkPermission from "../middlewares/checkPersmission.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

// Assign/Unassign permissions to roles
router
  .route("/assign-role")
  .post(
    checkPermission("assign_permission"),
    catchAsync(PermissionController.assignPermissionToRole),
  );

router
  .route("/unassign-role")
  .delete(
    checkPermission("unassign_permission"),
    catchAsync(PermissionController.unassignPermissionFromRole),
  );

router
  .route("/assign-user")
  .post(
    checkPermission("assign_permission"),
    catchAsync(PermissionController.assignPermissionToUser),
  );

router
  .route("/unassign-user")
  .delete(
    checkPermission("unassign_permission"),
    catchAsync(PermissionController.unassignPermissionFromUser),
  );

router
  .route("/")
  .get(
    checkPermission("view_permission"),
    catchAsync(PermissionController.getAllPermissions),
  )
  .post(
    checkPermission("create_permission"),
    catchAsync(PermissionController.createPermission),
  );

router
  .route("/:id")
  .patch(
    checkPermission("update_permission"),
    catchAsync(PermissionController.updatePermission),
  )
  .delete(
    checkPermission("delete_permission"),
    catchAsync(PermissionController.deletePermission),
  );

export default router;
