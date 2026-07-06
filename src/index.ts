import dotenv from "dotenv";
import express from "express";

import userRouter from "./routes/userRouter.ts";
import noticeRouter from "./routes/noticeRouter.ts";
import adminRouter from "./routes/admin/adminRouter.ts";
import inquiryRouter from "./routes/inquiryRouter.ts";
import walkLogRouter from "./routes/walkLogRouter.ts";
import petRouter from "./routes/petRouter.ts";
import communityPostRouter from "./routes/communityPostRouter.ts";
import cors from "cors";


dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.use(cors({ origin:  "http://localhost:8081", credentials: true }));


app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/notice", noticeRouter);
app.use("/inquiry", inquiryRouter);
app.use("/admin", adminRouter);
app.use("/walk-logs",walkLogRouter)
app.use("/post", communityPostRouter);

app.use("/pet", petRouter);

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
