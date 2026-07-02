import {CreateWalkLogDto} from "../dto/walk-log.dto.ts";
import * as walkLogRepository from "../repositories/walk-log.repository.ts";

export const createWalkLog = async (data: CreateWalkLogDto) => {
    return await walkLogRepository.createWalkLog(data);}