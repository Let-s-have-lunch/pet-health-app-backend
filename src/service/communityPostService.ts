import prisma from "../config/prisma.ts";
import { CommunityPostUpdateInput } from "../generated/prisma/models/CommunityPost.ts";
import { RoleType } from "../generated/prisma/enums.ts";

const getPostList = async (page: number, size: number) => {
    const total = await prisma.communityPost.count({
        where: {
            deletedAt: null,
        },
    });

    const list = await prisma.communityPost.findMany({
        orderBy: {
            id: "desc",
        },
        where: {
            deletedAt: null,
        },
        skip: (page - 1) * size,
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

const getPostById = async (postId: number) => {
    const post = await prisma.communityPost.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        },
    });

    if (!post) {
        throw new Error("POST_NOT_FOUND");
    }

    return prisma.communityPost.update({
        where: { id: postId },
        data: { views: { increment: 1 } },
        include: {
            user: {
                select: { id: true, nickname: true },
            },
        },
    });
};

const createPost = async (userId: number, title: string, content: string) => {
    return prisma.communityPost.create({
        data: {
            title,
            content,
            userId,
        },
    });
};

const updatePost = async (postId: number, userId: number, title: string, content: string) => {
    const post = await prisma.communityPost.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        },
    });

    if (!post) {
        throw new Error("POST_NOT_FOUND");
    }

    if (post.userId !== userId) {
        throw new Error("FORBIDDEN");
    }

    return prisma.communityPost.update({
        where: { id: postId },
        data: {
            title,
            content,
        },
    });
};

const deletePost = async (postId: number, userId: number, userRole: RoleType) => {
    const post = await prisma.communityPost.findFirst({
        where: {
            id: postId,
            deletedAt: null,
        },
    });

    if (!post) {
        throw new Error("POST_NOT_FOUND");
    }

    if (post.userId !== userId && userRole !== RoleType.ADMIN) {
        throw new Error("FORBIDDEN");
    }

    return prisma.communityPost.update({
        where: { id: postId },
        data: {
            deletedAt: new Date(),
        },
    });
};

export default { getPostList, getPostById, createPost, updatePost, deletePost };
