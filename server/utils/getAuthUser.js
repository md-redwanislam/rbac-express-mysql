// Only If need more information than stored in token then use this function.

import db from "../configs/db";

export const getAuthUser = async (req) => {
  const [users] = await db.execute("select * from users where email = ?", [
    req?.claims?.email,
  ]);

  if (!users || users.length == 0) {
    const err = new Error("User does not exists");
    err.statusCode = 404;
    throw err;
  }

  return users[0];
};
