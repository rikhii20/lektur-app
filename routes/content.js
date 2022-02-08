const express = require("express");
const router = express.Router();
const {
  createContent,
  getContents,
  getContent,
  updateContent,
  deleteContent,
} = require("../controllers/contentController");
const { isTeacher, isLogin } = require("../middlewares/auth");
const { uploadCloud } = require("../middlewares/upload-files");

router.post("/", isTeacher, uploadCloud("video", "video"), createContent);
router.get("/", getContents);
router.get("/:id", isLogin, getContent);
router.put("/:id", isTeacher, uploadCloud("video", "video"), updateContent);
router.delete("/:id", isTeacher, deleteContent);

module.exports = router;
