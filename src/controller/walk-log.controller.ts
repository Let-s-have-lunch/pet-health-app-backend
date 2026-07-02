import {Request, Response} from "express";
import { CreateWalkLogDto } from "../dto/walk-log.dto.ts";
import * as walkLogService from "../services/walk-log.service.ts";


export const createWalkLog = async (req: Request ,res: Response) => {
    try {
        const data: CreateWalkLogDto = req.body;
        const result = await walkLogService.createWalkLog(data);

        res.status(201).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "산책 기록 생성에 실패했습니다"
        })
    }
}