import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { PetCreateInput, PetUpdateInput } from "../generated/prisma/models/Pet.ts";

const getMyPets = async (userId: number) => {
    return prisma.pet.findMany({
        where: {
            userId,
            deletedAt: null,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

const createPet = async (data: PetCreateInput) => {
    try {
        return prisma.pet.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === "P2002") {
                const errorMessage = error.message;

                if (errorMessage.includes("registrationNumber")) {
                    throw new Error("ALREADY_EXISTS_REGISTRATION_NUMBER");
                }
            }
        }
        throw error;
    }
};

const updatePet = async (userId: number, petId: number, input: PetUpdateInput) => {
    const existPet = await prisma.pet.findFirst({
        where: {
            id: petId,
            userId: userId,
            deletedAt: null,
        },
    });

    if (!existPet) {
        throw new Error("PET_NOT_FOUND");
    }

    return prisma.pet.update({
        where: {
            id: petId,
        },
        data: {
            ...input,
        },
    });
};

const deletePet = async (userId: number, petId: number) => {
    const existPet = await prisma.pet.findFirst({
        where: {
            id: petId,
            userId,
            deletedAt: null,
        },
    });

    if (!existPet) {
        throw new Error("PET_NOT_FOUND");
    }

    return prisma.pet.update({
        where: {
            id: petId,
        },
        data: {
            deletedAt: new Date(),
        }
    });
};

export default {
    getMyPets,
    createPet,
    updatePet,
    deletePet,
};
