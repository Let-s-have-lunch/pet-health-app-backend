import multer from "multer";
import path from "path";
import * as fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 프로젝트 루트에 'uploads' 폴더를 만들어주세요
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${path.basename(file.originalname, ext)}_${Date.now()}${ext}`);
    },
});

export const upload = multer({ storage });