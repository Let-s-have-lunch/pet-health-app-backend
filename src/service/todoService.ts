import { CreateTodoInputType } from "../schemas/user/todo/createTodoSchema.ts";
import prisma from "../config/prisma.ts";

const getTodoList = async (userId: number, date: string) => {
    return prisma.todo.findMany({
        where: {
            userId,
            date,
        },
        orderBy: {
            id: "asc",
        },
    });
};

const createTodo = async (todoData: CreateTodoInputType, userId: number) => {
    return prisma.todo.create({
        data: {
            ...todoData,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
};

const updateTodo = async (userId: number, todoId: number, input: CreateTodoInputType) => {
    const todo = await prisma.todo.findFirst({
        where: {
            id: todoId,
            userId,
            deletedAt: null,
        },
    });

    if (!todo) {
        return null;
    }

    return prisma.todo.update({
        where: {
            id: todoId,
        },
        data: {
            ...input,
        },
    });
};

const deleteTodo = async (id: number, userId: number) => {
    const todo = await prisma.todo.findUnique({
        where: {
            id,
        },
    });

    if (!todo) {
        throw new Error("NOT_FOUND_TODO");
    }

    if (todo.userId !== userId) {
        throw new Error("FORBIDDEN");
    }

    return prisma.todo.delete({
        where: {
            id,
        },
    });
};

export default {
    getTodoList,
    createTodo,
    updateTodo,
    deleteTodo,
};
