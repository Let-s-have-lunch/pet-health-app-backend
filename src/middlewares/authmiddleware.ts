import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// 💡 요청(Request)에 user 정보를 담을 수 있게 타입을 확장합니다.
export interface AuthenticatedRequest extends Request {
    user?: { id: number; role: string };
}

// 토큰 암호화 키 (보통 .env 파일에 보관하지만, 우선은 이렇게 설정합니다)
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key";

// 1. 로그인 확인 미들웨어
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    // 헤더에 토큰이 없거나 형식이 틀리면 에러
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const token = authHeader.split(" ")[1];

    try {
        // 토큰 검증
        const decoded = jwt.verify(token, JWT_SECRET) as unknown as { id: number; role: string };
        req.user = decoded; // 검증된 유저 정보를 req.user에 담아둠
        next(); // 통과! 다음 단계(컨트롤러)로 이동
    } catch (error) {
        return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
};

// 2. 관리자 권한 확인 미들웨어 (게시글 숨기기 등 관리자 전용 기능에 사용)
export const adminMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "관리자 권한이 없습니다." });
    }
    next();
};
