import * as RoleService from "../services/role.service.js";

const assignRoleToUser = async (req, res) => {
  const { userId, roleId } = req.body;

  if (!userId || !roleId) {
    const err = new Error("User and role are required");
    err.statusCode = 400;
    throw err;
  }

  const result = await RoleService.assignRole(userId, roleId);
  console.log(result);

  res.status(201).json({
    success: true,
    message: "Role assigned to user successfully",
  });
};

const unassignRoleFromUser = async (req, res) => {
  const { userId, roleId } = req.body;

  if (!userId || !roleId) {
    const err = new Error("User and role are required");
    err.statusCode = 400;
    throw err;
  }

  await RoleService.unassignRole(userId, roleId);

  res.status(200).json({
    success: true,
    message: "Role unassigned from user successfully",
  });
};

const getAllRoles = async (req, res) => {
  const result = await RoleService.getAllRoles();

  res.status(200).json({
    success: true,
    data: result,
  });
};

const createRole = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    const err = new Error("Role name is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await RoleService.createRole(name);

  res.status(201).json({
    success: true,
    message: "Role created successfully",
    data: result,
  });
};

const updateRole = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!id) {
    const err = new Error("Role ID is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await RoleService.updateRole(id, name);

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
    data: result,
  });
};

const getUserRoles = async (req, res) => {
  const result = await RoleService.getUserRoles();

  res.status(200).json({
    success: true,
    data: result,
  });
};

const deleteRole = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    const err = new Error("Role ID is required");
    err.statusCode = 400;
    throw err;
  }

  const result = await RoleService.deleteRole(id);

  res.status(200).json({
    success: true,
    message: result.message,
  });
};

export {
  assignRoleToUser,
  createRole,
  deleteRole,
  getAllRoles,
  getUserRoles,
  unassignRoleFromUser,
  updateRole,
};
