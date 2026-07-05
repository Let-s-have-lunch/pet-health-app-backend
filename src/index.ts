import dotenv from "dotenv";
import express from "express";

import userRouter from "./routes/userRouter.ts";
import noticeRouter from "./routes/noticeRouter.ts";
import adminRouter from "./routes/admin/adminRouter.ts";
import inquiryRouter from "./routes/inquiryRouter.ts";
import walkLogRouter from "./routes/walkLogRouter.ts";
import communityPostRouter from "./routes/admin/post/communityPostRouter.ts";
import petRouter from "./routes/petRouter.ts";
import vetRecordRourter from "./routes/vetRecordRourter.ts";
import weightLogRouter from "./routes/weightLogRouter.ts";
import waterLogRouter from "./routes/waterLogRouter.ts";
import diaryRouter from "./routes/diaryRouter.ts";
import todoRouter from "./routes/todoRouter.ts";

dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";



app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/notice", noticeRouter);
app.use("/inquiry", inquiryRouter);
app.use("/admin", adminRouter);
app.use("/walk-logs",walkLogRouter)
app.use("/post", communityPostRouter);

app.use("/pet", petRouter);
app.use("/diary", diaryRouter);
app.use("/todo", todoRouter);

app.use("/walk-logs",walkLogRouter);
app.use("/vet-records", vetRecordRourter);
app.use("/weight-logs",weightLogRouter);
app.use("/water-logs",waterLogRouter);
app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
