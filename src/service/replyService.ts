import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class ReplyService {
    // 1. 댓글 작성
    createReply = async (userId: number, postId: number, content: string) => {
        return await prisma.reply.create({
            data: { userId, postId, content },
        });
    };

    // 2. 특정 게시글의 댓글 조회
    getRepliesByPost = async (postId: number) => {
        return await prisma.reply.findMany({
            where: { postId: postId },
            orderBy: { createdAt: "desc" },
        });
    };

    // 3. 댓글 삭제 (본인 확인 로직 추가)
    deleteReply = async (replyId: number, userId: number) => {
        // DB에서 댓글을 먼저 찾음
        const reply = await prisma.reply.findUnique({ where: { id: replyId } });

        // 댓글이 없거나, 작성자가 현재 로그인한 유저가 아니면 에러 발생
        if (!reply) throw new Error("댓글을 찾을 수 없습니다.");
        if (reply.userId !== userId) throw new Error("본인의 댓글만 삭제할 수 있습니다.");

        return await prisma.reply.delete({
            where: { id: replyId },
        });
    };

    // 4. 댓글 수정 (본인 확인 로직 추가)
    updateReply = async (replyId: number, userId: number, content: string) => {
        const reply = await prisma.reply.findUnique({ where: { id: replyId } });

        if (!reply) throw new Error("댓글을 찾을 수 없습니다.");
        if (reply.userId !== userId) throw new Error("본인의 댓글만 수정할 수 있습니다.");

        return await prisma.reply.update({
            where: { id: replyId },
            data: { content },
        });
    };
}
