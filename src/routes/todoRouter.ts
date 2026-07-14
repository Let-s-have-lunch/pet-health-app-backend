import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { createTodoSchema } from "../schemas/user/todo/createTodoSchema.ts";
import { validate } from "../middlewares/validate.ts";
import todoController from "../controller/todoController.ts";

const router = Router();

router.post("/create", authenticate, validate(createTodoSchema),todoController.createTodo);
router.get("/list", authenticate, todoController.getTodoList);
router.get("/range", authenticate, todoController.getTodoListByRange);
router.patch("/:id",authenticate,validate(createTodoSchema),todoController.updateTodo);
router.delete("/:id",authenticate,todoController.deleteTodo);

export default router;


