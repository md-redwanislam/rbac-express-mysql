import db from "../configs/db.js";

export const assignRole = async (userId, roleId) => {
  await db.execute(
    `
    INSERT INTO user_roles
    (user_id, role_id)
    VALUES (?, ?)
    `,
    [userId, roleId],
  );
};
