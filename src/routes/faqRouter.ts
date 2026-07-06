const express = require("express");
const router = express.Router();
const faqController = require("../controllers/faq.controller");

// FAQ 목록 조회
router.get("/", faqController.getFaqs);

// FAQ 상세 조회
router.get("/:id", faqController.getFaqDetail);

module.exports = router;
