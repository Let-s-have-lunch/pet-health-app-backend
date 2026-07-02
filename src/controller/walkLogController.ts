import { Request, Response } from "express";
import {
    CreateWalkLogInputType,
    createWalkLogSchema,
} from "../schemas/user/walkLog/createWalkLogSchema.ts";
import walkLogService from "../service/walkLogService.ts";
import { getWalkLogSchema } from "../schemas/user/walkLog/getWalkLogSchema.ts";
import {
    UpdateWalkLogInputType,
    updateWalkLogSchema,
} from "../schemas/user/walkLog/updateWalkLogSchema.ts";

const createWalkLog = async (req: Request, res: Response) => {
    try {
        const data: CreateWalkLogInputType = createWalkLogSchema.parse(req.body);

        const result = await walkLogService.createWalkLog(data);

        res.status(201).json(result);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "산책 기록 생성에 실패했습니다.",
        });
    }
};

const getWalkLogById = async (req: Request, res: Response) => {
    try {
        const { id } = getWalkLogSchema.parse(req.params);
        const result = await walkLogService.getWalkLogById(id);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            message: "산책 기록 조회에 실패했습니다.",
        });
    }
};

const updateWalkLog = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        const data: UpdateWalkLogInputType = updateWalkLogSchema.parse(req.body);
        const result = await walkLogService.updateWalkLog(id, data);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "산책 기록 수정에 실패했습니다.",
        });
    }
};

const deleteWalkLog = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await walkLogService.deleteWalkLog(id);

        res.status(200).json({
            message: "산책 기록이 삭제되었습니다.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "산책 기록 삭제에 실패했습니다.",
        });
    }
};

export default {
    createWalkLog,
    getWalkLogById,
    updateWalkLog,
    deleteWalkLog,
};
