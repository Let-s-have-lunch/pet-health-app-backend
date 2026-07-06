import { request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import TodoService from "../service/todoService.ts";
import todoService from "../service/todoService.ts";
import { CreateTodoInputType } from "../schemas/user/todo/createTodoSchema.ts";
import { PetUpdateInput } from "../generated/prisma/models/Pet.ts";
import petService from "../service/petService.ts";


const getTodoList = async (req: AuthRequest, res: Response) => {
    try{

        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
            return;
        }
        const date = req.query.date as string;
        const userId = req.user.id;
        const todolist = await todoService.getTodoList(userId, date);
        res.status(200).json({
            message: "할 일 목록을 성공적으로 불러왔습니다.",
            data: todolist,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        })
    }
}

const createTodo = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
        }
        const userId = user.id;
        const { title, date }: CreateTodoInputType = req.body;
        const todoData: CreateTodoInputType = { title, date };
        const newTodo = await todoService.createTodo(todoData, userId);
        res.status(201).json({
            message: "할 일이 등록되었습니다.",
            data: newTodo,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "할 일 등록중 서버 오류가 발생했습니다.",
        });
    }
};

const updateTodo = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
            return;
        }

        const todoId = Number(req.params.id);
        if (isNaN(todoId)) {
            res.status(400).json({ message: "유효하지 않은 ID 입니다." });
            return;
        }

        const userId = req.user?.id;
        const input: CreateTodoInputType = req.body;
        const result = await todoService.updateTodo(userId, todoId, input);

        if (!result) {
            return res.status(404).json({
                message: "할 일을 찾을 수 없습니다.",
            });
        }

        res.status(200).json({
            message: "할 일이 성공적으로 수정되었습니다.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
}

const deleteTodo = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({
                message: "유효하지 않은 ID입니다."
            })
            return;
        }

        if (!req.user) {
            res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
            return;
        }

        const userId = req.user.id;
        await todoService.deleteTodo( id, userId );
        res.status(200).json({
            message: "할 일이 성공적으로 삭제되었습니다."
        })


    } catch(error) {
        console.log(error);
        res.status(500).json({
            message: "할 일 삭제 중 오류가 발생되었습니다."
        })
    }

}

export default {
    getTodoList,
    createTodo,
    updateTodo,
    deleteTodo,
};
