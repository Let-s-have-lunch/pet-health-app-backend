// src/service/Community.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class CommunityService {
    // ==========================================
    // 1. 일반 유저 기능 (게시글 & 댓글)
    // ==========================================

    // 📝 [게시글 작성]
    async createPost(userId: number, title: string, content: string) {
        return await prisma.communityPost.create({
            data: { userId, title, content },
        });
    }

    // 📋 [게시글 목록 조회] - 페이징 처리 + 댓글 수 포함 (풍성함의 핵심! ⭐)
    async getPosts(limit: number, offset: number) {
        const [total, list] = await prisma.$transaction([
            prisma.communityPost.count({ where: { isHidden: false, deletedAt: null } }),
            prisma.communityPost.findMany({
                where: { isHidden: false, deletedAt: null },
                take: limit,
                skip: offset,
                orderBy: { createdAt: "desc" },
                include: {
                    _count: {
                        select: { replies: true }, // 💡 글 목록 볼 때 댓글이 몇 개 달렸는지 같이 가져오는 센스!
                    },
                },
            }),
        ]);

        return { total, list };
    }

    // 🔍 [게시글 상세 조회] - 조회수 중복 클릭 방지 로직 연동
    async getPostDetail(postId: number, shouldIncrement: boolean) {
        if (shouldIncrement) {
            // 중복 클릭이 아닐 때만 Prisma로 MySQL 조회수 1 증가!
            await prisma.communityPost.update({
                where: { id: postId },
                data: { viewCount: { increment: 1 } },
            });
        }

        const post = await prisma.communityPost.findUnique({
            where: { id: postId },
            include: {
                replies: {
                    where: { isHidden: false, deletedAt: null },
                    orderBy: { createdAt: "asc" }, // 댓글은 오래된 순(작성 순) 정렬이 기본!
                },
            },
        });

        if (!post || post.isHidden || post.deletedAt) {
            throw new Error("존재하지 않거나 블록된 게시글입니다.");
        }

        return post;
    }

    // 💬 [댓글 작성]
    async createReply(userId: number, postId: number, content: string) {
        // 먼저 해당 게시글이 실존하는지 체크
        const post = await prisma.communityPost.findUnique({ where: { id: postId } });
        if (!post) throw new Error("댓글을 달 게시글이 존재하지 않습니다.");

        return await prisma.reply.create({
            data: { userId, postId, content },
        });
    }

    // ==========================================
    // 2. 🛠️ [어드민 기능] 가이드라인 위반 처리 (Soft Delete)
    // ==========================================

    // 🚫 [어드민] 게시글 숨김/삭제 처리
    async hidePostByAdmin(postId: number) {
        const post = await prisma.communityPost.findUnique({ where: { id: postId } });
        if (!post) throw new Error("해당 게시글을 찾을 수 없습니다.");

        return await prisma.communityPost.update({
            where: { id: postId },
            data: { isHidden: true }, // 진짜 DELETE 대신 숨김(Soft Delete) 처리!
        });
    }

    // 🚫 [어드민] 댓글 숨김/삭제 처리 (💡 라우터 보완 사항 수용!)
    async hideReplyByAdmin(replyId: number) {
        const reply = await prisma.reply.findUnique({ where: { id: replyId } });
        if (!reply) throw new Error("해당 댓글을 찾을 수 없습니다.");

        return await prisma.reply.update({
            where: { id: replyId },
            data: { isHidden: true },
        });
    }
}
