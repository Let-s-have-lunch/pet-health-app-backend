export interface Inquiry {
    id: number;
    userId: number;
    title: string;
    content: string;
    status: "PENDING" | "ANSWERED"; // 👈 대기중 / 답변완료 상태
    answerContent: string | null; // 👈 [어드민 기능] 답변 내용
    answeredAt: Date | null; // 👈 [어드민 기능] 답변일 업데이트
    createdAt: Date;
}

// 실제 DB를 대신할 임시 테이블 공간
export const inquiriesTable: Inquiry[] = [];
