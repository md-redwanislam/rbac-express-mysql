import bcrypt from "bcryptjs";
import db from "../configs/db.js";

const getAllUsers = async () => {
  const [users] = await db.execute("select * from users ");

  if (users.length === 0) {
    const err = new Error("No user found");
    err.statusCode = 404;
    throw err;
  }
  users.map((user) => {
    user.password = undefined;
    user.created_at = undefined;
  });

  return users;
};

const getUserById = async (id) => {
  const [users] = await db.execute("SELECT * FROM users WHERE id = ?", [id]);

  if (users.length === 0) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  const user = users[0];
  user.password = undefined;
  user.created_at = undefined;
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
