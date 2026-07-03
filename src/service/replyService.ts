import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 1. 목록 조회 기계
const getRepliesByPostId = async (postId: number, page: number, size: number) => {
    const skip = (page - 1) * size;
    const total = await prisma.reply.count({ where: { postId } });
    const list = await prisma.reply.findMany({
        where: { postId },
        take: size,
        skip,
        orderBy: { id: "desc" },
        include: { user: { select: { id: true, nickname: true } } },
    });
    return { page, size, total, list };
};

// 2. 작성 기계
const createReply = async (userId: number, postId: number, content: string) => {
    const post = await prisma.post.findFirst({
        where: { id: postId, deletedAt: null },
    });
    if (!post) throw new Error("NOT_FOUND");

    return await prisma.reply.create({
        data: { userId, postId, content },
        include: { user: { select: { id: true, nickname: true, email: true } } },
    });
};

// 3. 수정 기계
const updateReply = async (id: number, userId: number, content: string) => {
    const reply = await prisma.reply.findUnique({ where: { id } });
    if (!reply) throw new Error("NOT_FOUND_REPLY");
    if (reply.userId !== userId) throw new Error("FORBIDDEN");

    return await prisma.reply.update({
        where: { id },
        data: { content },
    });
};

// 4. 삭제 기계
const deleteReply = async (id: number, userId: number) => {
    const reply = await prisma.reply.findUnique({ where: { id } });
    if (!reply) throw new Error("NOT_FOUND_REPLY");
    if (reply.userId !== userId) throw new Error("FORBIDDEN");

    return await prisma.reply.delete({ where: { id } });
};

export default {
    getRepliesByPostId,
    createReply,
    updateReply,
    deleteReply,
};
