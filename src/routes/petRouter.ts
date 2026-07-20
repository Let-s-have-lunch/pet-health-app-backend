import { Router } from "express";
import { validate } from "../middlewares/validate.ts";
import petController from "../controller/petController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { petCreateSchema } from "../schemas/pet/petCreateSchema.ts";
import { upload } from "../middlewares/multer.ts";
import { petUpdateSchema } from "../schemas/pet/petUpdateSchema.ts";

const router = Router();

router.get("/list/:petId", authenticate, petController.getPet);
router.get("/list", authenticate, petController.getMyPets);
router.post(
    "/create",
    authenticate,
    upload.single("profileImage"),
    validate(petCreateSchema),
    petController.createPet,
);
router.patch(
    "/update/:petId",
    authenticate,
    upload.single("profileImage"),
    validate(petUpdateSchema),
    petController.updatePet,
);
router.delete("/delete/:petId", authenticate, petController.deletePet);

export default router;
