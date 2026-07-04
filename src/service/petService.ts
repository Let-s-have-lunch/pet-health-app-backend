import prisma from "../config/prisma.ts";
import { Prisma } from "../generated/prisma/client.ts";
import { PetCreateInput, PetUpdateInput } from "../generated/prisma/models/Pet.ts";

const createPet = async (data: PetCreateInput) => {
    try {
        return await prisma.pet.create({
            data,
        });
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === "P2002") {
                const errorMessage = error.message;

                if(errorMessage.includes("registrationNumber")) {
                throw new Error("ALREADY_EXISTS_REGISTRATIONNUMBER");
                }
            }
        }
    throw new Error("UNKNOWN ERROR");
    }
};

const updatePet = async ( userId: number, petId: number, input: PetUpdateInput) => {
    const existPet = await prisma.pet.findFirst({
        where: {
            id: petId,
            userId: userId,
            deletedAt: null,
        },
    });

    if (existPet) {
        throw new Error("DUPLICATED_PET")
    }

    return prisma.pet.update({
        where: {
            id: petId,
        },
       data: {
            ...input,
        }
    });
}

export default {
    createPet,
    updatePet,
};
