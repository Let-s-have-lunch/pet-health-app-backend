import { inquiriesTable, Inquiry } from "./InquiryModel"; // 💡 마침표 하나 규칙!

export class InquiryService {
    // 1. [일반 유저] 1:1 문의 등록
    createInquiry(userId: number, title: string, content: string): Inquiry {
        const newInquiry: Inquiry = {
            id: inquiriesTable.length + 1,
            userId,
            title,
            content,
            status: "PENDING",
            answerContent: null,
            answeredAt: null,
            createdAt: new Date(),
        };
        inquiriesTable.push(newInquiry);
        return newInquiry;
    }

    // 2. [일반 유저] 본인 문의 내역 조회 (최신순 정렬)
    getMyInquiries(userId: number): Inquiry[] {
        return inquiriesTable
            .filter((inquiry: Inquiry) => inquiry.userId === userId)
            .sort((a: Inquiry, b: Inquiry) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    // 3. 🛠️ [어드민 기능] 1:1 문의 답변 등록 (명세서 요구사항 3종 반영)
    answerInquiry(inquiryId: number, answerContent: string): Inquiry {
        const inquiry = inquiriesTable.find((inquiryItem: Inquiry) => inquiryItem.id === inquiryId);
        if (!inquiry) throw new Error("해당 문의 내역을 찾을 수 없습니다.");

        inquiry.answerContent = answerContent; // ① answer_content 작성
        inquiry.status = "ANSWERED"; // ② 상태를 ANSWERED로 변경
        inquiry.answeredAt = new Date(); // ③ 답변일 업데이트

        return inquiry;
    }

    // 4. 🛠️ [추가 어드민 기능] 어드민용 전체 문의 목록 조회 (페이징 + 필터링)
    // 명세서의 "페이징 확장"과 "어드민 기능"을 위해 답변 대기중(PENDING)인 것부터 먼저 보여주는 로직입니다.
    getAllInquiriesForAdmin(page: number, limit: number) {
        const startIndex = (page - 1) * limit;

        // 대기중(PENDING)인 급한 문의를 위로, 그다음 최신순으로 정렬하는 고급 로직
        const sorted = [...inquiriesTable].sort((a, b) => {
            if (a.status === "PENDING" && b.status === "ANSWERED") return -1;
            if (a.status === "ANSWERED" && b.status === "PENDING") return 1;
            return b.createdAt.getTime() - a.createdAt.getTime();
        });

        const totalPages = Math.ceil(inquiriesTable.length / limit) || 1;

        return {
            inquiries: sorted.slice(startIndex, startIndex + limit),
            totalPages,
        };
    }

    // 5. 🛠️ [추가 어드민 기능] 규정 위반이거나 부적절한 문의글 어드민 권한 삭제/숨김
    // 명세서의 "어드민 권한으로 숨김 또는 삭제 처리" 공통 요구사항을 완벽 적용했습니다.
    deleteInquiryByAdmin(inquiryId: number): { message: string } {
        const index = inquiriesTable.findIndex((i:Inquiry) => i.id === inquiryId);

        if (index === -1) throw new Error("삭제할 문의 내역이 없습니다.");

        inquiriesTable.splice(index, 1); // 배열에서 진짜로 삭제 처리
        return { message: "어드민 권한으로 문의 내역이 완전히 삭제되었습니다." };
    }
}
