import { Router } from "express";
import vetRecordController from "../controller/vetRecordController.ts";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import {
    getVetRecordSchema,
    UpdateVetRecordSchema,
    CreateVetRecordSchema,
} from "../schemas/vetRecord/vetRecordSchema.ts";
import { upload } from "../middlewares/multer.ts";
const router = Router();


router.post(
    "/",
    authenticate,
    upload.single("image"),
    validate(CreateVetRecordSchema),
    vetRecordController.createVetRecord,
);

router.get("/pet/:petId", authenticate, vetRecordController.getVetRecordsByPetId);

router.get(
    "/:id",
    authenticate,
    validate(getVetRecordSchema),
    vetRecordController.getVetRecordById,
);

router.put(
    "/:id",
    authenticate,
    upload.single("image"),
    validate(UpdateVetRecordSchema),
    vetRecordController.updateVetRecord,
);

router.delete(
    "/:id",
    authenticate,
    vetRecordController.deleteVetRecord,
);

export default router;
