import express from "express";
import * as RoleController from "../controllers/role.controller.js";
import checkPermission from "../middlewares/checkPersmission.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

router
  .route("/assign")
  .post(
    checkPermission("assign_role"),
    catchAsync(RoleController.assignRoleToUser),
  );
router
  .route("/unassign")
  .delete(
    checkPermission("unassign_role"),
    catchAsync(RoleController.unassignRoleFromUser),
  );

router
  .route("/")
  .get(checkPermission("view_role"), catchAsync(RoleController.getAllRoles))
  .post(checkPermission("create_role"), catchAsync(RoleController.createRole));

router
  .route("/:id")
  .patch(checkPermission("update_role"), catchAsync(RoleController.updateRole))
  .delete(
    checkPermission("delete_role"),
    catchAsync(RoleController.deleteRole),
  );

export default router;
