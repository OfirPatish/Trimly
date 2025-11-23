import { Router } from "express";
import { register, login, getMe } from "../controllers/auth/authController.js";
import { validateRegister, validateLogin } from "../utils/request-validators/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/me", authenticate, getMe);

export default router;
