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
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

export default checkRole;
