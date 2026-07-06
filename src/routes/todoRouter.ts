import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { createTodoSchema } from "../schemas/user/toDO/createTodoSchema.ts";
import { validate } from "../middlewares/validate.ts";
import todoController from "../controller/todoController.ts";

const router = Router();

router.post("/", authenticate, validate(createTodoSchema), todoController.createTodo);
router.get("/:id", authenticate, todoController.getTodoById);
router.patch("/:id", authenticate, validate(createTodoSchema), todoController.updateTodo);
router.delete("/:id", authenticate, todoController.deleteTodo);

export default router;
