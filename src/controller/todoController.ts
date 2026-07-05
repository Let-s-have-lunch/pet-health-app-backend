import { request, Response } from 'express';
import { AuthRequest } from "../middlewares/auth.ts";
import TodoService from "../service/todoService.ts";
import todoService from "../service/todoService.ts";

const todoController = async (req: AuthRequest, res: Response) => {
    try {

        const createTodo = await todoService.createTodo();

    } catch(error) {
        console.error(error);
        res.status(500).json({
            message: "할 일 등록중 서버 오류가 발생했습니다."
        });
    }
}

export default {
    todoController,
}