import express from "express";
import * as AuthController from "../controllers/auth.controller.js";
import catchAsync from "../utils/catchAsync.js";

const router = express.Router();

router.route("/register").post(catchAsync(AuthController.register));
router.route("/login").post(catchAsync(AuthController.login));
router.route("/refresh-token").post(catchAsync(AuthController.refreshToken));

export default router;
