import { Router } from "express";
import { validate } from "../../../middlewares/validate.ts";
import adminUserController from "../../../controller/admin/adminUserController.ts";
import { adminCreateUserSchema } from "../../../schemas/admin/user/createUser.ts";
import { adminUpdateUserSchema } from "../../../schemas/admin/user/updateUser.ts";

const router = Router();

router.get("/list", adminUserController.getUserList);
router.post("/create", validate(adminCreateUserSchema), adminUserController.createUser);
router.patch("/:id", validate(adminUpdateUserSchema), adminUserController.updateUser);
router.get("/:id", adminUserController.getUserById);
router.patch("/:id/delete", adminUserController.deleteUser);


export default router;