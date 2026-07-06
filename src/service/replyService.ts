import prisma from "../config/prisma.ts";

const getRepliesByPostID = async (postId: number, page: number, size: number) => {
    const skip = (page - 1) * size;
    const total = await prisma.reply.count({
        where: {
            communityPostId: postId,
        },
    });

    const list = await prisma.reply.findMany({
        where: {
            communityPostId: postId,
        },
        orderBy: {
            id: "desc",
        },
        skip,
        take: size,
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });

    return {
        page,
        size,
        total,
        list,
    };
};

const createReply = async (userId: number, postId: number, content: string) => {
    const post = await prisma.communityPost.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        },
    });

    if (!post) {
        throw new Error("NOT_FOUND");
    }

    return prisma.reply.create({
        data: {
            userId,
            communityPostId: postId,
            content,
        },
        include: {
            user: {
                select: {
                    id: true,
                    nickname: true,
                },
            },
        },
    });
};

const updateReply = async (replyId: number, userId: number, content: string) => {
    const reply = await prisma.reply.findUnique({
        where: {
            id: replyId,
        },
    });
    if (!reply) {
        throw new Error("NOT_FOUND_REPLY");
    }

    if (reply.userId !== userId) {
        throw new Error("FORBIDDEN");
    }

    return prisma.reply.update({
        where: {
            id: replyId,
        },
        data: {
            content,
        },
    });
};

const deleteReply = async (id: number, userId: number) => {
    const reply = await prisma.reply.findUnique({
        where: {
            id,
        },
    });
    if (!reply) {
        throw new Error("NOT_FOUND_REPLY");
    }
    if (reply.userId !== userId) {
        throw new Error("FORBIDDEN");
    }

    return prisma.reply.delete({
        where: {
            id,
        },
    });
};

export default {
    getRepliesByPostID,
    createReply,
    deleteReply,
    updateReply,
};
