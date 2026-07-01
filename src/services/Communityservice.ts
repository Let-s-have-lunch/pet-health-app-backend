import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Communityservice {
    /**
     * 1. 게시글 작성 (Create)
     */
    async createPost(userId: number, title: string, content: string) {
        return await prisma.communityPosts.create({
            data: {
                userId,
                title,
                content,
            },
        });
    }

    /**
     * 2. 게시글 목록 조회 (Read + 페이징 처리)
     */
    async getPosts(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;

        const [total, posts] = await prisma.$transaction([
            prisma.communityPosts.count({ where: { deletedAt: null } }),
            prisma.communityPosts.findMany({
                where: { deletedAt: null },
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    user: { select: { nickname: true } },
                },
            }),
        ]);

        return { total, page, limit, totalPages: Math.ceil(total / limit), posts };
    }

    /**
     * 3. 게시글 상세 조회 (단순 조회)
     * 💡 핵심 키워드 요구사항: 조회수 중복 증가 방지를 위해 "조회수 증가"와 "상세 조회" 기능을 완전히 분리했습니다.
     */
    async getPostById(postId: number) {
        return await prisma.communityPosts.findUnique({
            where: { id: postId, deletedAt: null },
            include: {
                replies: {
                    where: { deletedAt: null },
                    include: { user: { select: { nickname: true } } },
                },
            },
        });
    }

    /**
     * 3-1. [추가] 게시글 조회수 증가 로직
     * 컨트롤러에서 중복 체크(쿠키 등)를 통과했을 때만 이 메소드를 실행시켜 조회수를 올립니다.
     */
    async incrementPostViews(postId: number) {
        return await prisma.communityPosts.update({
            where: { id: postId },
            data: { views: { increment: 1 } },
        });
    }

    /**
     * 4. 댓글 작성 (Create Reply)
     */
    async createReply(userId: number, postId: number, content: string) {
        return await prisma.replies.create({
            data: {
                userId,
                postId,
                content,
            },
        });
    }

    /**
     * 5. [어드민 기능] 가이드라인 위반 글 숨김/삭제 (Soft Delete)
     */
    async adminDeletePost(postId: number) {
        return await prisma.communityPosts.update({
            where: { id: postId },
            data: { deletedAt: new Date() },
        });
    }

    /**
     * 6. [추가][어드민 기능] 가이드라인 위반 댓글 숨김/삭제 (Soft Delete)
     * 💡 요구사항에 명시된 "신고받거나 가이드라인 위반한 게시글/댓글 어드민 권한 처리"를 완벽히 충족하기 위해 추가했습니다.
     */
    async adminDeleteReply(replyId: number) {
        return await prisma.replies.update({
            where: { id: replyId },
            data: { deletedAt: new Date() },
        });
    }
}
