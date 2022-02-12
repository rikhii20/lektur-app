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

router.post("/create", isTeacher, uploadCloud("video", "video"), createContent);
router.get("/fetch", getContents);
router.get("/fetch/:contentId", isLogin, getContent);
router.put("/edit", isTeacher, uploadCloud("video", "video"), updateContent);
router.delete("/delete", isTeacher, deleteContent);

module.exports = router;
