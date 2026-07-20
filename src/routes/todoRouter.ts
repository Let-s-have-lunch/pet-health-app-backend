import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { todoSchema } from "../schemas/todo/todoSchema.ts";
import { validate } from "../middlewares/validate.ts";
import todoController from "../controller/todoController.ts";

const router = Router();

router.post("/create", authenticate, validate(todoSchema),todoController.createTodo);
router.get("/list", authenticate, todoController.getTodoList);
router.get("/range", authenticate, todoController.getTodoListByRange);
router.patch("/:id",authenticate,validate(todoSchema),todoController.updateTodo);
router.delete("/:id",authenticate,todoController.deleteTodo);
router.patch("/:id/toggle", authenticate, todoController.toggleTodo);

export default router;


