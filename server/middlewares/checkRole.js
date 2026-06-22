import db from "../configs/db.js";
import { getAuthUser } from './../utils/getAuthUser';

const checkRole = (...allowedRoles) => {

     const [user] = await getAuthUser(req);
  return async (req, res, next) => {
    const [roles] = await db.execute(
      `
      SELECT r.name
      FROM roles r
      JOIN user_roles ur
        ON ur.role_id = r.id
      WHERE ur.user_id = ?
      `,
      [user[0].id],
    );

    const userRoles = roles.map((r) => r.name);

    const hasRole = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasRole) {
      const err = new Error("Role denied");
      err.statusCode = 403;
      throw err;
    }

    next();
  };
};

export default checkRole;
