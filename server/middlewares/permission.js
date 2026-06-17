import db from "../configs/db.js";

export const getUserPermissions = async (userId) => {
  const [permissions] = await db.execute(
    `
    SELECT DISTINCT p.name
    FROM permissions p

    LEFT JOIN role_permissions rp
        ON rp.permission_id = p.id

    LEFT JOIN user_roles ur
        ON ur.role_id = rp.role_id

    WHERE ur.user_id = ?

    UNION

    SELECT DISTINCT p.name
    FROM permissions p
    JOIN user_permissions up
      ON up.permission_id = p.id
    WHERE up.user_id = ?
    `,
    [userId, userId],
  );

  return permissions.map((p) => p.name);
};
