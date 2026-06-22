import express from "express";
import authRouter from "./auth.router.js";
import permissionRouter from "./permission.route.js";
import roleRouter from "./role.route.js";
import userRouter from "./user.route.js";

const customRoutes = express.Router();

customRoutes.use("/auth", authRouter);
customRoutes.use("/user", userRouter);
customRoutes.use("/permission", permissionRouter);
customRoutes.use("/role", roleRouter);

export default customRoutes;
