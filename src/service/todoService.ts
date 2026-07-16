import { CreateTodoInputType } from "../schemas/user/todo/createTodoSchema.ts";
import prisma from "../config/prisma.ts";

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
        },
    });
};

const toggleTodo = async (userId: number, todoId: number) => {
    // 1. 해당 할 일이 존재하는지, 그리고 이 유저의 것인지 먼저 확인
    const todo = await prisma.todo.findFirst({
        where: {
            id: todoId,
            userId,
            deletedAt: null, // 삭제된 할 일은 토글 불가
        },
    });

    if (!todo) {
        throw new Error("NOT_FOUND_TODO");
    }

    const newStatus = !todo.isCompleted;

    // 2. 상태 업데이트
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
