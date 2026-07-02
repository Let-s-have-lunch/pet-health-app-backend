// 1. 맨 위: 환경변수와 익스프레스 기본 라이브러리들
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser"; // ➕ [추가] 쿠키를 읽기 위해 꼭 필요해요!

// 2. 📂 ➕ [추가] 우리가 만든 라우터 두 형제를 불러옵니다.
import inquiryRouter from "./routes/Inquiry.route";
import communityRouter from "./routes/Community.route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || "8080";

// 3. 미들웨어 설정 구역
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // ➕ [추가] 조회수 중복 방지 쿠키 미들웨어를 여기에 쏙!

// 4. 🔗 ➕ [추가] 서버한테 "이 주소로 요청 들어오면 우리가 만든 파일로 보내줘"라고 연결합니다.
app.use("/api/inquiries", inquiryRouter); // 1:1 문의 주소 연결
app.use("/api/community", communityRouter); // 커뮤니티 주소 연결

// 5. 맨 아래: 서버 실행 (기존 코드 그대로!)
app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
