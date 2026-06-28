import db from "../configs/db.js";

const assignRole = async (userId, roleId) => {
  const [result] = await db.execute(
    `
    INSERT INTO user_roles
    (user_id, role_id)
    VALUES (?, ?)
    `,
    [userId, roleId],
  );
  return result;
};

const unassignRole = async (userId, roleId) => {
  await db.execute(
    `
    DELETE FROM user_roles
    WHERE user_id = ? AND role_id = ?
    `,
    [userId, roleId],
  );
};

const getAllRoles = async () => {
  const [roles] = await db.execute("SELECT * FROM roles");

  if (roles.length === 0) {
    const err = new Error("No roles found");
    err.statusCode = 404;
    throw err;
  }

  return roles;
};

const createRole = async (name) => {
  const [existingRoles] = await db.execute(
    "SELECT * FROM roles WHERE name = ?",
    [name],
  );

  if (existingRoles.length > 0) {
    const err = new Error("Role already exists with this name");
    err.statusCode = 409;
    throw err;
  }

  // Create role
  const [result] = await db.execute("INSERT INTO roles (name) VALUES ( ?)", [
    name,
  ]);

  return {
    name,
  };
};

const updateRole = async (id, name) => {
  const [roles] = await db.execute("SELECT * FROM roles WHERE id = ?", [id]);

  if (roles.length === 0) {
    const err = new Error("Role not found");
    err.statusCode = 404;
    throw err;
  }

  // Check if name is already taken by another role
  if (name) {
    const [existingRoles] = await db.execute(
      "SELECT * FROM roles WHERE name = ? AND id != ?",
      [name, id],
    );

    if (existingRoles.length > 0) {
      const err = new Error("Role with this name already exists");
      err.statusCode = 409;
      throw err;
    }
  }

  // Update role
  await db.execute("UPDATE roles SET name = ? WHERE id = ?", [
    name || roles[0].name,
    id,
  ]);

  return {
    name: name || roles[0].name,
  };
};

const deleteRole = async (id) => {
  const [roles] = await db.execute("SELECT * FROM roles WHERE id = ?", [id]);

  if (roles.length === 0) {
    const err = new Error("Role not found");
    err.statusCode = 404;
    throw err;
  }

  await db.execute("DELETE FROM roles WHERE id = ?", [id]);

  return { message: "Role deleted successfully" };
};

const getUserRoles = async () => {
  const [rows] = await db.execute(
    `SELECT u.name AS user_name, r.name AS role_name
     FROM users u
     JOIN user_roles ur ON u.id = ur.user_id
     JOIN roles r ON r.id = ur.role_id
     ORDER BY r.name, u.name`,
  );
  return rows;
};

export {
  assignRole,
  createRole,
  deleteRole,
  getAllRoles,
  getUserRoles,
  unassignRole,
  updateRole,
};
