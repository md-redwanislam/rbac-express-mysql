import jwt from "jsonwebtoken";

import config from "../configs/config.js";

const checkAuth = (req, res, next) => {
  if (
    req.path === "/" ||
    req.path === "/api/v1/auth/refresh-token" ||
    req.path === "/api/v1/auth/register" ||
    req.path === "/api/v1/auth/login" ||
    req.path.startsWith("/api/v1/users/")
  ) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    const err = new Error("Token not found");
    err.statusCode = 401;
    throw err;
  }

  jwt.verify(token, config.jwtoken.secretKey, (err, decoded) => {
    if (err) {
      const err = new Error("Invalid Token");
      err.statusCode = 401;
      throw err;
    }

    if (decoded.type !== "access") {
      const err = new Error("Invalid Token Type");
      err.statusCode = 403;
      throw err;
    }

    req.claims = decoded;
    next();
  });
};

export default checkAuth;
