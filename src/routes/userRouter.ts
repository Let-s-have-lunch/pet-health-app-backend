import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import userController from "../controller/userController.ts";
import { createUserSchema } from "../schemas/user/auth/createUser.ts";
import { validate } from "../middlewares/validate.ts";
import { loginSchema } from "../schemas/user/auth/login.ts";
import { updateUserSchema } from "../schemas/user/auth/updateUserSchema.ts";
import { updatePasswordSchema } from "../schemas/user/auth/updatePasswordSchema.ts";
import { withdrawUserSchema } from "../schemas/user/auth/withdrawUser.ts";

const router = Router();

router.get("/me", authenticate, userController.getMe);
router.post("/create", validate(createUserSchema), userController.createUser);
router.post("/login", validate(loginSchema), userController.login);
router.patch("/update", authenticate, validate(updateUserSchema), userController.updateUser);
router.patch("/password", authenticate, validate(updatePasswordSchema), userController.updatePassword);
router.patch("/withdraw", authenticate, validate(withdrawUserSchema), userController.withdrawUser);

export default router;


