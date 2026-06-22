import { getAuthUser } from "../utils/getAuthUser.js";
import { getUserPermissions } from "../utils/permission.js";

const checkPermission = (permission) => {
  return async (req, res, next) => {
    const user = await getAuthUser(req);
    const permissions = await getUserPermissions(user.id);

    if (!permissions.includes(permission)) {
      const err = new Error("Permission Denied");
      err.statusCode = 403;
      throw err;
    }

    next();
  };
};

export default checkPermission;
