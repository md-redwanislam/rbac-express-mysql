import db from "../configs/db.js";

const assignPermission = async (roleId, permissionId) => {
  // Check if permission is already assigned to role
  const [existingAssignment] = await db.execute(
    `SELECT * FROM role_permissions WHERE role_id = ? AND permission_id = ?`,
    [roleId, permissionId],
  );

  if (existingAssignment.length > 0) {
    const err = new Error("Permission is already assigned to this role");
    err.statusCode = 409;
    throw err;
  }

  await db.execute(
    `
  INSERT INTO role_permissions
  (role_id, permission_id)
  VALUES (?, ?)
  `,
    [roleId, permissionId],
  );
};

const unassignPermission = async (roleId, permissionId) => {
  await db.execute(
    `
  DELETE FROM role_permissions
  WHERE role_id = ? AND permission_id = ?
  `,
    [roleId, permissionId],
  );
};

const assignPermissionToUser = async (userId, permissionId) => {
  const [existingAssignment] = await db.execute(
    `SELECT * FROM user_permissions WHERE user_id = ? AND permission_id = ?`,
    [userId, permissionId],
  );

  if (existingAssignment.length > 0) {
    const err = new Error("Permission is already assigned to this user");
    err.statusCode = 409;
    throw err;
  }

  await db.execute(
    `
  INSERT INTO user_permissions
  (user_id, permission_id)
  VALUES (?, ?)
  `,
    [userId, permissionId],
  );
};

const unassignPermissionToUser = async (userId, permissionId) => {
  await db.execute(
    `
  DELETE FROM user_permissions
  WHERE user_id = ? AND permission_id = ?
  `,
    [userId, permissionId],
  );
};

const getAllPermissions = async () => {
  const [permissions] = await db.execute("SELECT * FROM permissions");

  if (permissions.length === 0) {
    const err = new Error("No permissions found");
    err.statusCode = 404;
    throw err;
  }

  return permissions;
};

const createPermission = async (name) => {
  const [existingPermissions] = await db.execute(
    "SELECT * FROM permissions WHERE name = ?",
    [name],
  );

  if (existingPermissions.length > 0) {
    const err = new Error("Permission already exists with this name");
    err.statusCode = 409;
    throw err;
  }

  // Create permission
  const [result] = await db.execute(
    "INSERT INTO permissions (name) VALUES ( ?)",
    [name],
  );

  return {
    name,
  };
};

const updatePermission = async (id, name) => {
  const [permissions] = await db.execute(
    "SELECT * FROM permissions WHERE id = ?",
    [id],
  );

  if (permissions.length === 0) {
    const err = new Error("Permission not found");
    err.statusCode = 404;
    throw err;
  }

  if (name) {
    const [existingPermissions] = await db.execute(
      "SELECT * FROM permissions WHERE name = ? AND id != ?",
      [name, id],
    );

    if (existingPermissions.length > 0) {
      const err = new Error("Permission with this name already exists");
      err.statusCode = 409;
      throw err;
    }
  }

  // Update permission
  await db.execute("UPDATE permissions SET name = ? WHERE id = ?", [
    name || permissions[0].name,
    id,
  ]);

  return {
    id,
    name: name || permissions[0].name,
  };
};

const deletePermission = async (id) => {
  // Check if permission exists
  const [permissions] = await db.execute(
    "SELECT * FROM permissions WHERE id = ?",
    [id],
  );

  if (permissions.length === 0) {
    const err = new Error("Permission not found");
    err.statusCode = 404;
    throw err;
  }

  // Delete permission
  await db.execute("DELETE FROM permissions WHERE id = ?", [id]);

  return { message: "Permission deleted successfully" };
};

export {
  assignPermission,
  assignPermissionToUser,
  createPermission,
  deletePermission,
  getAllPermissions,
  unassignPermission,
  unassignPermissionToUser,
  updatePermission,
};
