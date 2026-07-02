import { Router } from "express";
import { authenticate } from "../middlewares/auth.ts";
import { validate } from "../middlewares/validate.ts";
import CommunityPostController from "../controller/communityPostController.ts";
import { communityPostSchema } from "../schemas/post/communityPostSchema.ts";


const router = Router();

router.post(
    "/create",
    authenticate,
    validate(communityPostSchema),
    CommunityPostController.createPost,
);

router.get("/", CommunityPostController.getPostList);

router.get("/:postId", CommunityPostController.getPostById);

router.patch(
    "/:postId",
    authenticate,
    validate(communityPostSchema),
    CommunityPostController.updatePost,
);

router.delete("/:postId", authenticate, CommunityPostController.deletePost);

export default router;
