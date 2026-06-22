import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../configs/config.js";
import db from "../configs/db.js";
import getNewToken from "../utils/getNewToken.js";

const register = async (name, email, password) => {
  const [users] = await db.execute("select * from users where email = ?", [
    email,
  ]);

  if (users.length > 0) {
    const err = new Error("User already exists with this mail.");
    err.statusCode = 404;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [rows] = await db.execute(
    `INSERT INTO users 
      (name, email, password) 
      VALUES (?, ?, ?)`,
    [name, email, hashedPassword],
  );

  return {
    id: rows.insertId,
    name,
    email,
  };
};

const login = async (email, password) => {
  const [users] = await db.execute("select * from users where email = ?", [
    email,
  ]);

  if (users.length == 0) {
    const err = new Error("User not found with this mail.");
    err.statusCode = 404;
    throw err;
  }

  const isPasswordMatch = await bcrypt.compare(password, users[0].password);

  if (!isPasswordMatch) {
    const err = new Error("Incorrect password");
    err.statusCode = 401;
    throw err;
  }

  const { token, refreshToken } = await getNewToken(users[0]);

  users[0].password = undefined;
  users[0].id = undefined;

  return { user: users[0], token, refreshToken };
};

const refreshToken = async (refreshToken) => {
  const decoded = await jwt.verify(
    refreshToken,
    config.jwtoken.refresh_secretKey,
  );

  if (!decoded) {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    throw err;
  }

  const [users] = await db.execute("select * from users where id = ?", [
    decoded.id,
  ]);

  if (users.length == 0) {
    const err = new Error("User is not authorized");
    err.statusCode = 401;
    throw err;
  }

  const { token, refreshToken: newRefreshToken } = await getNewToken(users[0]);

  return { token, newRefreshToken };
};

const logout = async (email, password) => {
  const [users] = await db.execute("select * from users where email = ?", [
    email,
  ]);

  if (users.length == 0) {
    const err = new Error("User not found with this mail.");
    err.statusCode = 404;
    throw err;
  }

  const isPasswordMatch = await bcrypt.compare(password, users[0].password);

  if (!isPasswordMatch) {
    const err = new Error("Incorrect password");
    err.statusCode = 401;
    throw err;
  }

  const { token, refreshToken } = await getNewToken(users[0]);

  users[0].password = undefined;
  users[0].id = undefined;

  return { user: users[0], token, refreshToken };
};

export { login, logout, refreshToken, register };
