import { getUserPermissions } from "./permission";

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const [user] = await getAuthUser(req);
    const permissions = await getUserPermissions(user[0].id);

    if (!permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    next();
  };
};

export default checkPermission;
