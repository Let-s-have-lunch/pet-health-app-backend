import { CreateTodoInputType } from "../schemas/user/todo/createTodoSchema.ts";
import prisma from "../config/prisma.ts";

const getTodoList = async (userId: number, date: Date ) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const nextDay = new Date(startOfDay);
    nextDay.setDate(nextDay.getDate() + 1);


    return prisma.todo.findMany({
        where: {
            userId,
            date: {
                gte: startOfDay,
                lt: nextDay,
            },
            deletedAt: null,
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
    const todo = await prisma.todo.findFirst({
        where: {
            id,
            userId,
            deletedAt: null,
        },
    });

    if (!todo) {
        throw new Error("NOT_FOUND_TODO");
    }


    return prisma.todo.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
        }
    });
};

export default {
    getTodoList,
    createTodo,
    updateTodo,
    deleteTodo,
};
