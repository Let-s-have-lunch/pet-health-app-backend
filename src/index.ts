import dotenv from "dotenv";
import express from "express";
import walkLogRouter from "./routes/walkLogRoute.ts";

import userRouter from "./routes/userRouter.ts";
import noticeRouter from "./routes/noticeRouter.ts";
import adminRouter from "./routes/admin/adminRouter.ts";
import inquiryRouter from "./routes/inquiryRouter.ts";
import weightLogRouter from "./routes/weightLogRouter.ts";
import waterLogRouter from "./routes/waterLogRouter.ts";
import vetRecordRouter from "./routes/vetRecordRouter.ts";
import communityPostRouter from "./routes/communityPostRouter.ts";
import petRouter from "./routes/petRouter.ts";
import diaryRouter from "./routes/diaryRouter.ts";
import todoRouter from "./routes/todoRouter.ts";
import homeRouter from "./routes/homeRouter.ts";
import cors from "cors";
import path from "path";
import replyRouter from "./routes/replyRoute.ts";

// 새로 만든 라우터들을 import 하세요
import adminFaqRouter from "./routes/admin/adminFaqRouter.ts";
import faqRouter from "./routes/faqRouter.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.use(cors({ origin: ["http://localhost:8081", "http://localhost:8082", "http://localhost:8083",], credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/home", homeRouter);
app.use("/user", userRouter);
app.use("/notice", noticeRouter);
app.use("/inquiry", inquiryRouter);
app.use("/admin", adminRouter);
app.use("/post", communityPostRouter);
app.use("/reply", replyRouter);


app.use("/walk-logs", walkLogRouter);
app.use("/replies", replyRouter);

// 💡 [여기 추가됨!] 방금 불러온 라우터들을 실제 경로와 연결해줍니다.
app.use("/admin/faq", adminFaqRouter); // 관리자용
app.use("/faq", faqRouter);           // 일반 사용자용
app.use("/pet", petRouter);
app.use("/diary", diaryRouter);
app.use("/todo", todoRouter);

// 로그 및 건강 기록 담당 라우터
app.use("/walk-logs", walkLogRouter);
app.use("/vet-records", vetRecordRouter);
app.use("/weight-logs", weightLogRouter);
app.use("/water-logs", waterLogRouter);

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});