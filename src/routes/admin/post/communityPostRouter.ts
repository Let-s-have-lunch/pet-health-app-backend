import { Router } from "express";
import {
    createCommunityPostSchema,
    updateCommunityPostSchema,
} from "../../../schemas/post/communityPostSchema.ts";
import { validate } from "../../../middlewares/validate.ts";
import CommunityPostController from "../../../controller/communityPostController.ts";
import { authenticate } from "../../../middlewares/auth.ts";

const router = Router();

router.post("/create", authenticate, validate(createCommunityPostSchema), CommunityPostController.createPost);

// 2. 목록조회 (GET) - 쿼리스트링(page, size) 사용
router.get("/", CommunityPostController.getPostList);

// 3. 상세조회 (GET) - 동적라우팅(:postId) 사용
router.get("/:postId", CommunityPostController.getPostById);

// 4. 수정 (PATCH) - 동적라우팅(:postId), body 사용
router.patch("/:postId",authenticate, validate(updateCommunityPostSchema), CommunityPostController.updatePost);

// 5. 삭제 (DELETE) - 동적라우팅(:postId) 사용
// router.delete("/:postId",authenticate, CommunityPostController.deletePost);

export default router;
