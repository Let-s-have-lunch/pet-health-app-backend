import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import todoService from "../service/todoService.ts";

const createTodo = async (req: AuthRequest, res: Response) => {
    try {
        const createTodo = await todoService.createTodo();
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "할 일 등록중 서버 오류가 발생했습니다.",
        });
    }
};

const getTodoById = async (req: Request, res: Response) => {
    return;
};

const updateTodo = async (req: Request, res: Response) => {
    return;
};

const deleteTodo = async (req: Request, res: Response) => {
    return;
};

export default {
    createTodo,
    getTodoById,
    updateTodo,
    deleteTodo,
};
