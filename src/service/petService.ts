import { PetCreateInputType } from "../schemas/user/pet/petCreateSchema.ts";
import prisma from "../config/prisma.ts";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";
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

const updatePet = async (data: PetUpdateInput) => {}

export default {
    createPet,
};
