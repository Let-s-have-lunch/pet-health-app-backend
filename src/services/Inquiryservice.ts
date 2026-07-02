// src/service/Inquiry.service.ts
import { PrismaClient } from "@prisma/client"; // 💡 생성된 Prisma 클라이언트 가져오기
import { InquiryStatus } from "../generated/prisma"; // 💡 스키마에서 정의한 Enum 타입

const prisma = new PrismaClient();

export class InquiryService {
    // 1. 일반 유저: 1:1 문의 등록
    async createInquiry(userId: number, title: string, content: string) {
        // Prisma를 이용해 DB에 Inquiry 생성
        return await prisma.inquiry.create({
            data: {
                userId,
                title,
                content,
                status: InquiryStatus.PENDING, // 초기 상태는 무조건 PENDING
            },
        });
    }

    // 2. 일반 유저: 본인 문의 내역 조회 (페이징 반영)
    async getMyInquiries(userId: number, limit: number, offset: number) {
        // 과제 가산점 포인트: 총 개수(total)와 목록(list)을 동시에 가져오기 (Prisma 트랜잭션 활용)
        const [total, list] = await prisma.$transaction([
            prisma.inquiry.count({
                where: { userId },
            }),
            prisma.inquiry.findMany({
                where: { userId },
                take: limit, // 몇 개를 가져올지 (limit)
                skip: offset, // 어디서부터 가져올지 (offset)
                orderBy: {
                    createdAt: "desc", // 최신순 정렬은 커뮤니티의 기본 매너!
                },
            }),
        ]);

        return {
            total,
            list,
            currentPage: Math.floor(offset / limit) + 1,
            totalPages: Math.ceil(total / limit),
        };
    }

    // 3. 🛠️ [어드민 기능]: 1:1 문의 답변 기능
    async answerInquiry(inquiryId: number, answerContent: string) {
        // 먼저 해당 문의가 존재하는지 검증
        const inquiry = await prisma.inquiry.findUnique({
            where: { id: inquiryId },
        });

        if (!inquiry) {
            throw new Error("존재하지 않는 문의글입니다.");
        }

        // 과제 임무 반영: answer_content 작성, 상태를 ANSWERED로 변경, 답변일 업데이트
        return await prisma.inquiry.update({
            where: { id: inquiryId },
            data: {
                answerContent,
                status: InquiryStatus.ANSWERED,
                answeredAt: new Date(), // 현재 시간으로 답변일 업데이트
            },
        });
    }
}
