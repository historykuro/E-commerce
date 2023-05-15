import express from "express";
import {
  register,
  login,
  getCurrent,
  refreshAccessToken,
} from "../controllers/user.js";
import { verifyAccessToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
// router.get("/logout", logout);
router.get("/current", verifyAccessToken, getCurrent);
router.get("/refreshToken", verifyAccessToken, refreshAccessToken);

export default router;
