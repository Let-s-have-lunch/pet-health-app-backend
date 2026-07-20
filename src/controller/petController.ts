import { Response } from "express";
import petService from "../service/petService.ts";
import { PetCreateInput } from "../generated/prisma/models/Pet.ts";
import { AuthRequest } from "../middlewares/auth.ts";
import { PetUpdateInputType } from "../schemas/pet/petUpdateSchema.ts";

const getPet = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
            return;
        }

        const petId = Number(req.params.petId);
        if (isNaN(petId)) {
            res.status(400).json({ message: "유효하지 않은 반려동물 ID 입니다." });
            return;
        }

        const userId = req.user.id;
        const pet = await petService.getPet(userId, petId);

        if (!pet) {
            res.status(404).json({
                message: "반려동물을 찾을 수 없습니다.",
            });
            return;
        }

        res.status(200).json({
            message: "반려동물 정보를 조회했습니다.",
            data: pet,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        });
    }
};

const getMyPets = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                message: "로그인이 필요한 서비스입니다.",
            });
        }

        const userId = req.user.id;
        const pets = await petService.getMyPets(userId);

        res.status(200).json({
            message: "반려동물 목록 정보를 조회했습니다.",
            data: pets,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "서버 에러가 발생했습니다.",
        });
    }
};

const createPet = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        res.status(401).json({
            message: "로그인이 필요한 서비스입니다.",
        });
        return;
    }

    try {
        const {
            species,
            breed,
            name,
            birthdate,
            registrationNumber,
            gender,
        } = req.body;

        const neutered = req.body.neutered === "true";
        let profileImage: string | null = null;
        if (req.file) {
            profileImage = `/uploads/${req.file.filename}`;
        }

        const petData: PetCreateInput = {
            species,
            breed: breed ?? null,
            name,
            profileImage,
            birthdate: birthdate ? new Date(birthdate) : null,
            registrationNumber: registrationNumber ?? null,
            gender,
            neutered,
            user: { connect: { id: req.user.id } },
        };

        const newPet = await petService.createPet(petData);
        res.status(201).json({ message: "새로운 반려동물이 등록되었습니다.", data: newPet });
    } catch (error) {
        if (error instanceof Error && error.message === "ALREADY_EXISTS_REGISTRATION_NUMBER") {
            return res.status(409).json({
                message: "이미 사용중인 등록번호입니다.",
            });
        }

        console.log(error);
        return res.status(500).json({ message: "반려동물 등록 중 오류가 발생했습니다. " });
    }
};

const updatePet = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
            return;
        }

        const petId = Number(req.params.petId);
        if (isNaN(petId)) {
            res.status(400).json({ message: "유효하지 않은 반려동물 ID 입니다." });
            return;
        }

        const userId = req.user.id;
        const input: PetUpdateInputType = { ...req.body, neutered: req.body.neutered === "true" };
        if (req.file) {
            input.profileImage = `/uploads/${req.file.filename}`;
        }

        console.log("===== UPDATE =====");
        console.log("req.file =", req.file);
        console.log("req.body.profileImage =", req.body.profileImage);
        console.log("req.body =", req.body);

        const result = await petService.updatePet(userId, petId, input);


        res.status(200).json({
            message: "반려동물 정보가 성공적으로 수정되었습니다.",
            data: result,
        });
    } catch (error) {
        console.error("updatePet 오류");
        console.error(error);
        if (error instanceof Error) {
            if (error.message === "PET_NOT_FOUND") {
                return res.status(404).json({
                    message: "반려동물을 찾을 수 없습니다.",
                });
            }
        }
        res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
};

const deletePet = async (req: AuthRequest<{ petId: string }>, res: Response) => {
    try {
        const petId = Number(req.params.petId);
        if (isNaN(petId)) {
            res.status(400).json({ message: "유효하지 않은 반려동물 ID 입니다." });
            return;
        }
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다. " });
            return;
        }

        const userId = req.user.id;

        await petService.deletePet(userId, petId);
        res.status(200).json({
            message: "반려동물 정보가 삭제되었습니다.",
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            if (error.message === "PET_NOT_FOUND") {
                return res.status(404).json({
                    message: "반려동물을 찾을 수 없습니다.",
                });
            }

            return res.status(500).json({
                message: "서버 에러가 발생하였습니다.",
            });
        }
    }
};

export default {
    getPet,
    getMyPets,
    createPet,
    updatePet,
    deletePet,
};
