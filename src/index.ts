import dotenv from "dotenv";
import express from "express";

import userRouter from "./routes/userRouter.ts";
import noticeRouter from "./routes/noticeRouter.ts";
import adminRouter from "./routes/admin/adminRouter.ts";
import inquiryRouter from "./routes/inquiryRouter.ts";
import walkLogRouter from "./routes/walkLogRouter.ts";
import weightLogRouter from "./routes/weightLogRouter.ts";
import waterLogRouter from "./routes/waterLogRouter.ts";
import vetRecordRouter from "./routes/vetRecordRouter.ts";
import communityPostRouter from "./routes/communityPostRouter.ts";
import petRouter from "./routes/petRouter.ts";
import diaryRouter from "./routes/diaryRouter.ts";
import todoRouter from "./routes/todoRouter.ts";
import homeRouter from "./routes/homeRouter.ts";
import cors from "cors";
dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://localhost:8081"], credentials: true }));

app.use("/home", homeRouter);
app.use("/user", userRouter);
app.use("/notice", noticeRouter);
app.use("/inquiry", inquiryRouter);
app.use("/admin", adminRouter);
app.use("/post", communityPostRouter);


app.use("/pet", petRouter);
app.use("/diary", diaryRouter);
app.use("/todo", todoRouter);

// 로그 및 건강 기록 담당 라우터
app.use("/walk-logs",walkLogRouter);
app.use("/vet-records", vetRecordRouter);
app.use("/weight-logs",weightLogRouter);
app.use("/water-logs",waterLogRouter);

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
