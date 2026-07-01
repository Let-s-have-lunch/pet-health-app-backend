import prisma from "../config/prisma.ts";

const getNoticeList = async (page: number, size: number) => {
    const total = await prisma.notice.count();

    const list = await prisma.notice.findMany({
        orderBy: {
            id: "desc",
        },
        skip: (page - 1) * size,
        take: size,
    });

    return {
        page,
        size,
        total,
        list,
    };
};

const getNoticeById = async (id: number) => {
    const notice = await prisma.notice.findUnique({
        where: {
            id,
        },
    });

    if (!notice) {
        throw new Error("NOT_FOUND_NOTICE");
    }
    return notice;
};

const createNotice = async (title: string, content: string) => {
    return prisma.notice.create({
        data: {
            title,
            content,
        },
    });
};

const updateNotice = async (id: number, title: string, content: string) => {
    // 그 Notice 글이 살아있는지 체크
    await getNoticeById(id);

    // 업데이트를 진행해야 함
    return prisma.notice.update({
        where: {
            id,
        },
        data: {
            title,
            content,
        },
    });
};

const deleteNotice = async (id: number) => {
    // Notice 글이 살아있는지 체크
    await getNoticeById(id);

    // Notice 글을 삭제
    return prisma.notice.delete({
        where: {
            id,
        },
    });
};

export default { getNoticeById, createNotice, updateNotice, deleteNotice, getNoticeList };

