import { Request, Response } from "express";
import userService from "../service/userService.ts";
import petService from "../service/petService.ts";import { PetCreateInput, PetUpdateInput } from "../generated/prisma/models/Pet.ts";
import { AuthRequest } from "../middlewares/auth.ts";
import { PetUpdateInputType } from "../schemas/user/pet/petUpdateSchema.ts";

const createPets = async (req: AuthRequest, res: Response) => {
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
            profileImage,
            birthdate,
            registrationNumber,
            gender,
            neutered,
        } = req.body;

        const petData: PetCreateInput = {
            species,
            breed: breed ?? null,
            name,
            profileImage: profileImage ?? null,
            birthdate: birthdate ?? null,
            registrationNumber: registrationNumber ?? null,
            gender,
            neutered,
            user: { connect: { id: req.user.id } },
        };

        const newPet = await petService.createPet(petData);
        res.status(201).json({ message: "새로운 반려동물이 등록되었습니다.", data: newPet });
    } catch (error) {
        if (error instanceof Error) {
            switch (error.message) {
                case "ALREADY_EXISTS_REGISTRATIONNUMBER":
                    res.status(409).json({ message: "이미 사용중인 등록번호입니다." });
                    return;
                default:
                    console.log(error);
                    res.status(500).json({ message: "반려동물 등록 중 오류가 발생했습니다. "});
            }
        }
        console.log(error);
        res.status(500).json({ message: "반려동물 등록 중 오류가 발생했습니다. "});
    }
};

const updatePets = async (req: AuthRequest<{petId: string}>, res: Response) => {
    try {
        if (!req.user) {
            res.status(401).json({ message: "인증되지 않은 사용자입니다. "});
            return;
        }

        const petId = Number(req.params.petId);
        if (isNaN(petId)) {
            res.status(400).json({ message: "유효하지 않은 반려동물 ID 입니다." })
            return;
        }

        const userId = req.user?.id;
        const input: PetUpdateInput = req.body;

        const result = await petService.updatePet( userId, petId, input );

        res.status(200).json({
            message: "반려동물 정보가 성공적으로 수정되었습니다.",
        })

    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "서버 에러가 발생했습니다." });

    }
};



export default {
    createPets,
    updatePets,
};
