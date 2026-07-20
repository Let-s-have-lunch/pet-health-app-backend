import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.ts";
import todoService from "../service/todoService.ts";
import { TodoInputType } from "../schemas/todo/todoSchema.ts";

const getTodoList = async (req: AuthRequest, res: Response) => {
    try {
        const date = req.query.date;

        if (!date) {
            return res.status(400).json({
                message: "날짜를 입력해주세요.",
            });
        }

        if (typeof date !== "string") {
            return res.status(400).json({
                message: "잘못된 날짜입니다.",
            });
        }
        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                message: "유효하지 않은 날짜입니다.",
            });
        }

        if (!req.user) {
            return res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
        }
        const userId = req.user.id;

        const todoList = await todoService.getTodoList(userId, parsedDate);

        res.status(200).json({
            message: "할 일 목록을 성공적으로 불러왔습니다.",
            data: todoList,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        });
    }
};

const getTodoListByRange = async (req: AuthRequest, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({
                message: "시작일(startDate)과 종료일(endDate)을 모두 입력해주세요.",
            });
        }

        if (typeof startDate !== "string" || typeof endDate !== "string") {
            return res.status(400).json({
                message: "잘못된 날짜 형식입니다.",
            });
        }

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
            return res.status(400).json({
                message: "유효하지 않은 날짜입니다.",
            });
        }

        if (!req.user) {
            return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
        }
        const userId = req.user.id;

        const todoList = await todoService.getTodoListByRange(
            userId,
            parsedStartDate,
            parsedEndDate,
        );

        res.status(200).json({
            message: "기간별 할 일 목록을 성공적으로 불러왔습니다.",
            data: todoList,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "기간별 할 일 목록 조회 중 서버 에러가 발생했습니다.",
        });
    }
};

const createTodo = async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({ message: "로그인이 필요한 서비스입니다." });
        }
        const userId = user.id;
        const todoData: TodoInputType = req.body;
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
            return res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
        }

        const todoId = Number(req.params.id);
        if (isNaN(todoId)) {
            res.status(400).json({ message: "유효하지 않은 ID 입니다." });
            return;
        }

        const userId = req.user.id;
        const input: TodoInputType = req.body;
        const result = await todoService.updateTodo(userId, todoId, input);

        if (!result) {
            return res.status(404).json({
                message: "할 일을 찾을 수 없습니다.",
            });
        }

        res.status(200).json({
            message: "할 일이 성공적으로 수정되었습니다.",
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
};

const deleteTodo = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                message: "유효하지 않은 ID입니다.",
            });
        }

        if (!req.user) {
            res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
            return;
        }

        const userId = req.user.id;
        await todoService.deleteTodo(id, userId);
        res.status(200).json({
            message: "할 일이 성공적으로 삭제되었습니다.",
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error && error.message === "NOT_FOUND_TODO") {
            return res.status(404).json({
                message: "할 일을 찾을 수 없습니다.",
            });
        }
        res.status(500).json({
            message: "할 일 삭제 중 오류가 발생되었습니다.",
        });
    }
};

const toggleTodo = async (req: AuthRequest<{ id: string }>, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "인증되지 않은 사용자입니다." });
        }

        const todoId = Number(req.params.id);
        if (isNaN(todoId)) {
            return res.status(400).json({ message: "유효하지 않은 ID 입니다." });
        }

        const userId = req.user.id;
        const result = await todoService.toggleTodo(userId, todoId);

        res.status(200).json({
            message: "할 일 완료 상태가 성공적으로 변경되었습니다.",
            data: result,
        });
    } catch (error) {
        if (error instanceof Error && error.message === "NOT_FOUND_TODO") {
            res.status(404).json({ message: "존재하지 않는 todo 입니다."})
            return;
        }
        console.error(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
};

export default {
    getTodoList,
    getTodoListByRange,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
};
