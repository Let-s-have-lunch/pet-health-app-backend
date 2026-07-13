import { Router } from "express";
import { validate } from "../middlewares/validate.ts";
import petController from "../controller/petController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { petCreateSchema } from "../schemas/user/pet/petCreateSchema.ts";

const router = Router();

router.get("/list/:petId", authenticate, petController.getPet);
router.get("/list", authenticate, petController.getMyPets);
router.post("/create", authenticate, validate(petCreateSchema), petController.createPet);
router.patch("/update/:petId", authenticate, validate(petCreateSchema), petController.updatePet);
router.delete("/:petId", authenticate, petController.deletePet);

export default router;