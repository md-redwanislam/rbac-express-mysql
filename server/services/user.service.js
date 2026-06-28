import bcrypt from "bcryptjs";
import db from "../configs/db.js";

const getAllUsers = async () => {
  const [users] = await db.execute("SELECT id, name, email FROM users");

  if (users.length === 0) {
    const err = new Error("No user found");
    err.statusCode = 404;
    throw err;
  }

  for (const user of users) {
    const [roles] = await db.execute(
      `SELECT r.id, r.name FROM roles r
       INNER JOIN user_roles ur ON r.id = ur.role_id
       WHERE ur.user_id = ?`,
      [user.id],
    );
    user.roles = roles;

    const [permissions] = await db.execute(
      `SELECT DISTINCT p.id, p.name FROM permissions p
       WHERE p.id IN (
         SELECT rp.permission_id FROM role_permissions rp
         INNER JOIN user_roles ur2 ON rp.role_id = ur2.role_id
         WHERE ur2.user_id = ?
         UNION
         SELECT up.permission_id FROM user_permissions up
         WHERE up.user_id = ?
       )`,
      [user.id, user.id],
    );
    user.permissions = permissions;
  }

  return users;
};

const getUserById = async (id) => {
  const [users] = await db.execute(
    "SELECT id, name, email FROM users WHERE id = ?",
    [id],
  );

  if (users.length === 0) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const user = users[0];

  const [roles] = await db.execute(
    `SELECT r.id, r.name FROM roles r
     INNER JOIN user_roles ur ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [user.id],
  );
  user.roles = roles;

  const [permissions] = await db.execute(
    `SELECT DISTINCT p.id, p.name FROM permissions p
     WHERE p.id IN (
       SELECT rp.permission_id FROM role_permissions rp
       INNER JOIN user_roles ur2 ON rp.role_id = ur2.role_id
       WHERE ur2.user_id = ?
       UNION
       SELECT up.permission_id FROM user_permissions up
       WHERE up.user_id = ?
     )`,
    [user.id, user.id],
  );
  user.permissions = permissions;

  return user;
};

const createUser = async (name, email, password) => {
  const [existingUsers] = await db.execute(
    "SELECT * FROM users WHERE email = ?",
    [email],
  );

  if (existingUsers.length > 0) {
    const err = new Error("User already exists with this email");
    err.statusCode = 409;
    throw err;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert user
  const [result] = await db.execute(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
  );

  return {
    id: result.insertId,
    name,
    email,
  };
};

const updateUser = async (id, name, email) => {
  // Check if user exists
  const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

  if (users.length === 0) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  if (email) {
    const [existingUsers] = await db.execute(
      "SELECT * FROM users WHERE email = ? AND id != ?",
      [email, id],
    );

    if (existingUsers.length > 0) {
      const err = new Error("Email is already taken");
      err.statusCode = 409;
      throw err;
    }
  }

  await db.execute("UPDATE users SET name = ?, email = ? WHERE id = ?", [
    name || users[0].name,
    email || users[0].email,
    id,
  ]);

  return {
    id,
    name: name || users[0].name,
    email: email || users[0].email,
  };
};

const deleteUser = async (id) => {
  const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

  if (users.length === 0) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  await db.execute("DELETE FROM users WHERE id = ?", [id]);

  return { message: "User deleted successfully" };
};

export { createUser, deleteUser, getAllUsers, getUserById, updateUser };
