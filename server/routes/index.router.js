import express from "express";
import authRouter from "./auth.router.js";

const customRoutes = express.Router();

customRoutes.use("/auth", authRouter);

export default customRoutes;
