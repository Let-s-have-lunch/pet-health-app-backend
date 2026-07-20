import prisma from "../config/prisma.ts";
import { TodoInputType } from "../schemas/todo/todoSchema.ts";

const getTodoList = async (userId: number, date: Date) => {
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

const getTodoListByRange = async (userId: number, startDate: Date, endDate: Date) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const nextDayOfEnd = new Date(endDate);
    nextDayOfEnd.setHours(0, 0, 0, 0);
    nextDayOfEnd.setDate(nextDayOfEnd.getDate() + 1);

    return prisma.todo.findMany({
        where: {
            userId,
            date: {
                gte: start,
                lt: nextDayOfEnd,
            },
            deletedAt: null,
        },
        orderBy: {
            date: "asc",
        },
    });
};

const createTodo = async (todoData: TodoInputType, userId: number) => {
    return prisma.todo.create({
        data: {
            title: todoData.title,
            date: new Date(todoData.date), // 문자열을 명시적으로 Date로 변환
            user: { connect: { id: userId } },
        },
    });
};

const updateTodo = async (userId: number, todoId: number, input: TodoInputType) => {
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
        },
    });
};

const toggleTodo = async (userId: number, todoId: number) => {
    const todo = await prisma.todo.findFirst({
        where: {
            id: todoId,
            userId,
            deletedAt: null,
        },
    });

    if (!todo) {
        throw new Error("NOT_FOUND_TODO");
    }

    const newStatus = !todo.isCompleted;

    return prisma.todo.update({
        where: {
            id: todoId,
        },
        data: {
            isCompleted: newStatus
        },
    });
};

export default {
    getTodoList,
    getTodoListByRange,
    createTodo,
    updateTodo,
    deleteTodo,
    toggleTodo
};
