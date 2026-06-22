import * as PermissionService from "../services/permission.service.js";

const assignPermissionToRole = async (req, res) => {
  const { roleId, permissionId } = req.body;

  if (!roleId || !permissionId) {
    const err = new Error("Role and permission are required");
    err.statusCode = 400;
    throw err;
  }

  await PermissionService.assignPermission(roleId, permissionId);

  res.status(201).json({
    success: true,
    message: "Permission assigned to role successfully",
  });
};

const unassignPermissionFromRole = async (req, res) => {
  const { roleId, permissionId } = req.body;

  if (!roleId || !permissionId) {
    const err = new Error("Role and permission are required");
    err.statusCode = 400;
    throw err;
  }

  await PermissionService.unassignPermission(roleId, permissionId);

  res.status(200).json({
    success: true,
    message: "Permission unassigned from role successfully",
  });
};

const assignPermissionToUser = async (req, res) => {
  const { userId, permissionId } = req.body;

  if (!userId || !permissionId) {
    const err = new Error("User and permission are required");
    err.statusCode = 400;
    throw err;
  }

  await PermissionService.assignPermissionToUser(userId, permissionId);

  res.status(201).json({
    success: true,
    message: "Permission assigned to user successfully",
  });
};

const unassignPermissionFromUser = async (req, res) => {
  const { userId, permissionId } = req.body;

  if (!userId || !permissionId) {
    const err = new Error("User and permission are required");
    err.statusCode = 400;
    throw err;
  }

  await PermissionService.unassignPermissionToUser(userId, permissionId);

  res.status(200).json({
    success: true,
    message: "Permission unassigned from user successfully",
  });
};

const getAllPermissions = async (_req, res) => {
  const result = await PermissionService.getAllPermissions();

  res.status(200).json({
    success: true,
    data: result,
  });
};

const createPermission = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error("Permission name is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await PermissionService.createPermission(name);

  res.status(201).json({
    success: true,
    message: "Permission created successfully",
    data: result,
  });
};

const updatePermission = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    const err = new Error("Permission ID is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await PermissionService.updatePermission(id, name);

  res.status(200).json({
    success: true,
    message: "Permission updated successfully",
    data: result,
  });
};

const deletePermission = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    const err = new Error("Permission ID is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await PermissionService.deletePermission(id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
};

export {
  assignPermissionToRole,
  assignPermissionToUser,
  createPermission,
  deletePermission,
  getAllPermissions,
  unassignPermissionFromRole,
  unassignPermissionFromUser,
  updatePermission,
};
