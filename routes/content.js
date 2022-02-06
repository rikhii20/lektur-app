const express = require("express");
const router = express.Router();
const {
  createContent,
  getContents,
  getContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");
const { isTeacher } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-image");

router.post("/", isTeacher, uploadCloud("video"), createContent);
router.get("/", getContents);
router.get("/:id", getContent);
router.put("/:id", isTeacher, uploadCloud("video"), updateContent);
router.delete("/:id", isTeacher, deleteContent);

module.exports = router;
