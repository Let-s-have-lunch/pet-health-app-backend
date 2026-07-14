import dotenv from "dotenv";
import express from "express";
import walkLogRouter from "./routes/walkLogRoute.ts";

import userRouter from "./routes/userRouter.ts";
import noticeRouter from "./routes/noticeRouter.ts";
import adminRouter from "./routes/admin/adminRouter.ts";
import inquiryRouter from "./routes/inquiryRouter.ts";
import replyRouter from "./routes/replyRoute.ts";

// 새로 만든 라우터들을 import 하세요
import adminFaqRouter from "./routes/admin/adminFaqRouter.ts";
import faqRouter from "./routes/faqRouter.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/notice", noticeRouter);
app.use("/inquiry", inquiryRouter);
app.use("/admin", adminRouter);

app.use("/walk-logs", walkLogRouter);
app.use("/replies", replyRouter);

// 💡 [여기 추가됨!] 방금 불러온 라우터들을 실제 경로와 연결해줍니다.
app.use("/admin/faq", adminFaqRouter); // 관리자용
app.use("/faq", faqRouter);           // 일반 사용자용

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});