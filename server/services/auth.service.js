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

  const token = await getNewToken(users[0]);

  users[0].password = undefined;
  users[0].id = undefined;

  return { user: users[0], token };
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

  const token = await getNewToken(users[0]);

  return token;
};

const emailVerify = async (email) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    const err = new Error("User not found with this mail.");
    err.statusCode = 404;
    throw err;
  }
  const code = String(Math.floor(100000 + Math.random() * 900000));

  await UserModel.updateOne({ email }, { otp: code });

  await sendEmail(email, "OTP Verification", `Your OTP code is ${code}`);

  return { Message: "OTP sent to your mail" };
};

const otpVerify = async (email, code) => {
  const user = await UserModel.findOne({ email, otp: code });

  if (!user) {
    const err = new Error("User not found with this mail.");
    err.statusCode = 404;
    throw err;
  }

  return { message: "OTP verified successfully." };
};

const resetPassword = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    const err = new Error("User not found with this mail.");
    err.statusCode = 404;
    throw err;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await UserModel.updateOne({ email }, { password: hashedPassword, otp: 0 });

  return { message: "Password changed successfully." };
};

export { emailVerify, login, otpVerify, refreshToken, register, resetPassword };
