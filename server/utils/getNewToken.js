import jwt from "jsonwebtoken";

import config from "../configs/config.js";

const getNewToken = (user) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: "access",
    },
    config.jwtoken.secretKey,

    {
      expiresIn: config.jwtoken.expiresIn,
    },
  );

  const refreshToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      type: "refresh",
    },
    config.jwtoken.refresh_secretKey,
    {
      expiresIn: config.jwtoken.refresh_expiresIn,
    },
  );
  if (!token && !refreshToken) {
    throw new Error("Token not generated");
  }
  return { token, refreshToken };
};

export default getNewToken;
