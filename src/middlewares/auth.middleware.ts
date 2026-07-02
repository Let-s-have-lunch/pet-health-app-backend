import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 💡 요청(Request)에 user 정보를 담을 수 있게 확장
export interface AuthenticatedRequest extends Request {
    user?: { id: number; role: string };
}

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// 1. 로그인 확인 미들웨어 (문지기)
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; role: string };
        req.user = decoded; // 토큰에서 꺼낸 정보를 req.user에 저장
        next(); // 통과! 다음 단계로!
    } catch (error) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};

// 2. 어드민 권한 확인 미들웨어 (이중 잠금 🔐)
export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "어드민 권한이 없습니다." });
    }
    next(); // 어드민 맞음! 통과!
};
