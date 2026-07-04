import { Router } from "express";
import { validate } from "../middlewares/validate.ts";
import petController from "../controller/petController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { petCreateSchema } from "../schemas/user/pet/petCreateSchema.ts";

const router = Router();

router.post("/create", authenticate, validate(petCreateSchema), petController.createPets);
router.patch("/update/:petId", authenticate, validate(petCreateSchema), petController.updatePets);
router.delete("/delete/:petId", authenticate, petController.deletePets);

export default router;