import dotenv from "dotenv";
import express from "express";
import walkLogRouter from "./routes/walk-log.route.ts";


dotenv.config();

const app = express();

const PORT = process.env.PORT || "8080";

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/walk-logs",walkLogRouter);

app.listen(PORT, () => {
    console.log(`서버 실행됨! http://localhost:${PORT}`);
});
