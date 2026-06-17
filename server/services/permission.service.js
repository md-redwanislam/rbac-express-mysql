import db from "../configs/db.js";

export const assignRole = async (userId, permissionId) => {
  await db.execute(
    `
  INSERT INTO role_permissions
  (role_id, permission_id)
  VALUES (?, ?)
  `,
    [roleId, permissionId],
  );
};
