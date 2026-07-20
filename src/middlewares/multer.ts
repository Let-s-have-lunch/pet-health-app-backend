import multer from "multer";
import path from "path";
import * as fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads",);

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${path.basename(file.originalname, ext)}_${Date.now()}${ext}`);
    },
});

export const upload = multer({ storage });